// model/needyProfileModel.js
var mongoose = require('mongoose');

const schema = new mongoose.Schema({
  emailid: { type: String, required: true },
  contact: { type: String, required: true },
  frontadhar: String,
  backadhar: String,
  name : String,
  dob : String,
  address :String
}, { versionKey: false });

var NeedyColRef = mongoose.model('NeedyProfile', schema);

module.exports = NeedyColRef;
