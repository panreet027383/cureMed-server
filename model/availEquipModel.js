var mongoose=require("mongoose");

var userObj = {
    emailid : String , 
    equipmentName : String,
    purpose : String ,
    condition : String,
    issues : String,
    batteryCondition : String,
    expiryDate : String,
    proflepic : String,
}
 var ver = {
      versionKey: false, // to avoid __v field in table come by default
    };

    var schema = new mongoose.Schema(userObj,ver);
    var EquipColRef = mongoose.model("AvailEquipment",schema);

module.exports = EquipColRef ; 