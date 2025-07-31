var mongoose=require("mongoose");

var userObj = {
    emailid : {type:String,required : true, index : true, unique : true},
    names : String,
    age : Number ,
    gender : String,
    curraddress : String,
    currcity : String,
    contact : String,
    qualification : String,
    occupation : String,
    adharpic : String,
    profilepic : String, 
    status: {type:Number, default: 1}
}
 var ver = {
      versionKey: false, // to avoid __v field in table come by default
    };

    var schema=new mongoose.Schema(userObj,ver);
    var DonorColRef = mongoose.model("DonorDetails",schema);

module.exports = DonorColRef; 