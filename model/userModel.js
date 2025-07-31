var mongoose=require("mongoose");

var userObj = {
    uid : {type:String,required : true, index : true, unique : true},
    pwd : String,
    ut : String,
    status: {type:Number, default: 1}

}
 var ver = {
      versionKey: false, // to avoid __v field in table come by default
    };

    var schema=new mongoose.Schema(userObj,ver);
    var UsercolRef = mongoose.model("Project",schema);

    module.exports = UsercolRef; 

