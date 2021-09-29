var mongoose = require('mongoose')
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId; // ObjectId == 몽고DB에 저장된 이미지 도큐먼트의 _id
                                // ObjectId는 같은 document 내에서 유일함이 보장되는 12 byte binary data다.

var CommentSchema = new Schema({
    image_id : {type : ObjectId},
    email : {type: String},
    name : {type : String},
    gravatar : {type : String},
    comment : {type : String},
    timestamp : {type : Date, 'default' : Date.now}
});


CommentSchema.virtual('image').set(function(image){
    this._image = image;
}).get(function(){
    return this._image;
});

module.exports = mongoose.model('Comment', CommentSchema);