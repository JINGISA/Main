var models = require('../models'); //db 모델 가지고오기~
var async = require('async');

module.exports ={
    newest : function(cb){
        models.Comment.find({}, {}, {limit : 5, sort : {'timestamp': -1 }}, function(err, comments){
            //댓글 각각에 image 연결
            var attachImage = function(comment, nexte){
                models.Image.findOne({ _id : comment.image_id}, function(err, image){
                    if (err) throw err;
                    comment.image = image;
                    nexte(err);
                })
            }

            async.each(comments, attachImage, function(err){
                if (err) throw err;
                cb(err, comments);         
            });
        });
    }

};