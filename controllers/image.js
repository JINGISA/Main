var fs = require('fs'),
    path = require('path'),
    sidebar = require('../helpers/sidebar'),
    Models = require('../models'),
    md5 = require('MD5');


module.exports = {
    index: function(req, res) {
        var viewModel = {
            image: {},
            comments:[]
        };
        console.log("================================================");
        Models.Image.findOne({ filename : { $regex : req.params.image_id}}, function(err, image){ //image : 찾은 이미지
            if(err) throw err; // 에러처리
            if(image) {
                image.views = image.views+1; //조회수
                console.log(image);
                viewModel.image = image; // 뷰모델에 이미지 삽입
                image.save(); //저장
                
                Models.Comment.find({ image_id : image._id}, {}, {sort: { 'timestamp' : 1}}, function(err, comments){
                    if(err) {throw err}

                    viewModel.comments = comments;
                    sidebar(viewModel, function(viewModel){
                        res.render('image', viewModel);
                    })

                })
            }else{
                res.redirect('/'); // 돌려보내기
            }
        });
        
    },
    create: function(req, res) {
        console.log("image function insert...1");
        
        
        var saveImage = function(){
            //
            console.log("image function insert...2")
            var possible = 'abcdefghijklmnopqrstuvwxyz1234567890',
                imgUrl ='';
                console.log("image function insert...3")
            for (var i = 0 ; i<6; i+=1){
                imgUrl += possible.charAt(Math.floor(Math.random()*possible.length)); // imgUrl삽입
            }
            console.log(imgUrl);
            
            Models.Image.find({filename : imgUrl }, function(err, images){
                if(images.length >0){
                    saveImage() // ?? 재귀?
                } else {
                    var tempPath = req.files.file.path, //업로드될 파일 임시 위치(tmp)
                    ext = path.extname(req.files.file.name).toLowerCase(), // 업로드될 파일 확장자
                    targetPath = path.resolve('./public/upload/' + imgUrl + ext); // 최종적으로 저장될 위치
                
                    if (ext ==='.png' || ext ==='.jpg'|| ext ==='.jpeg' || ext ==='.gif' ){
                        fs.rename(tempPath, targetPath, function(err){  // 무슨말? 

                            console.log(tempPath)
                            if(err) throw err;
                        //
                        var newImg = new Models.Image({ // DB에 저장할 데이터 스키마
                            title : req.body.title,
                            description : req.body.description,
                            filename : imgUrl + ext
                        });
                        newImg.save(function(err, image){ // DB 저장
                            console.log('Successfully inserted image : ' + image.filename); 
                            
                            res.redirect('./images/'+ image.uniqueId);
                        })
                        console.log(tempPath)
                        });
                    }else{
                        fs.unlink(tempPath, function(){
                        if (err) throw err;
                        res.json(500,{error: 'ONLY IMAGE FILES ARE ALLOWED'});
                        });
                    }

               }
            });
            
        };// saveimage 함수

        saveImage();
    },
    like: function(req, res) {
        console.log("like 진입0")
        Models.Image.findOne({ filename : {$regex: req.params.image_id}}, function(err, image){
            console.log("like 진입1")
            if(!err && image){
                console.log("like 진입2")
                console.log("image ~~~", image)
                image.likes = image.likes+1;
                console.log("image ~~~", image.likes)
                image.save(function(err){
                    if(err){res.json(err);}
                    else{res.json({likes:image.likes})};
                })
            }
        })
    },
    
    comment: function(req, res) {
        Models.Image.findOne({filename : {$regex: req.params.image_id}}, function(err, image){
            console.log("코멘트 진입")
            if( !err && image){
                console.log("파라미터",req.params)
                console.log("바디 :" ,req.body)
                var newComment = new Models.Comment(req.body);

                console.log(newComment)
                newComment.gravatar = md5(newComment.email); // 암호화?
                
                newComment.image_id = image._id;

                newComment.save(function(err, comment){
                    if (err) {throw err;}

                    res.redirect('/images/' + image.uniqueId + '#' + comment._id);
                });                
                }else{
                    res.redirect('/')
            }
        })
    },

    remove: function(req, res){
        Models.Image.findOne({ filename : { $regex : req.params.image_id}}, function(err, image){ //사진 삭제
            if (err) { throw err}
            
            fs.unlink(path.resolve('./public/upload/'+image.filename), function(err){ // upload 폴더에서 사진 삭제
                if (err) {throw err}

                Models.Comment.remove({image_id: image._id}, function(err){ // 사진에 달린 댓글 삭제
                    image.remove(function(err){ // db에서 이미지 정보 삭제  
                        if (!err) {res.json(true);}
                        else {res.json(false);}
                    })
                })
            }) // 

        })
    }
    
};
