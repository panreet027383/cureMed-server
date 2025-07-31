var mongoose=require("mongoose");

var userObj = {
    emailid : {type: String ,  required : true, index : true},
    medicine : String,
    company : String ,
    expirydate : String,
    packing : String,
    quantity : Number,
    info : String,
}
 var ver = {
      versionKey: false, // to avoid __v field in table come by default
    };

    var schema = new mongoose.Schema(userObj,ver);
    var MedicineColRef = mongoose.model("AvailMedicines",schema);

module.exports = MedicineColRef ; 