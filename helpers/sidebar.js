var Stats = require('./stats'),
    Images = require('./images'),
    Comments = require('./comments'),
    async = require('async');

module.exports = function(viewModel, callback){
    async.parallel([
        function(next) {
            Stats(next);  // Stats를 실행하고 
        },
        function(next) {
            Images.popular(next);
        },
        function(next) {
            Comments.newest(next);
        }
    ], function(err, results){
        viewModel.sidebar = {
            stats: results[0],
            popular: results[1],
            comments: results[2]
        };
        console.log(viewModel.sidebar)


        callback(viewModel);
    });
};