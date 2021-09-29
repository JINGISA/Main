var sidebar = require('../helpers/sidebar');
var ImageModel = require('../models').Image;

module.exports = {
    index: function(req, res) {
        var viewModel = {
            images: []
        };

        ImageModel.find({}, {}, { sort: { timestamp: -1 }}, function(err, images) {
            if (err) { throw err; }

            viewModel.images = images;
            console.log("Ee");
            console.log(viewModel); 
            console.log("under : viewModel")
            //console.log(viewModel.images); // viewModel에 이미지 정보가 있는지 확인
           
            sidebar(viewModel, function(viewModel) { // 사이드바 데이터 삽입
                console.log(viewModel);
                res.render('index', viewModel);
            });
            
        });

    }
};