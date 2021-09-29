
/*
module.exports = function(){
    var stats ={
        Images : 0,
        comment : 0,
        views : 0,
        likes : 0
    };

    return stats;
}

*/
/* jshint node: true */
'use strict';

var models = require('../models'),
    async = require('async');

module.exports = function(callback) {

    var tasks = [
        function(next) {
            models.Image.count({}, next);
        },
        function(next) {
            models.Comment.count({}, next);
        },
        function(next) {
            models.Image.aggregate([{ $group : {
                _id : '1',
                viewsTotal : { $sum : '$views' }
            }}], function(err, result) {
                var viewsTotal = 0;
                if (result.length > 0) {
                    viewsTotal += result[0].viewsTotal;
                }
                next(null, viewsTotal);
            });
        },
        function(next) {
            models.Image.aggregate([{ $group : {
                _id : '1',
                likesTotal : { $sum : '$likes' }
            }}], function (err, result) {
                var likesTotal = 0;
                if (result.length > 0) {
                    likesTotal += result[0].likesTotal;
                }
                next(null, likesTotal);
            });
        }
    ]


    async.parallel(tasks, function(err, results){
        callback(null, {
            images: results[0],
            comments: results[1],
            views: results[2],
            likes: results[3]
        });
    });
};
