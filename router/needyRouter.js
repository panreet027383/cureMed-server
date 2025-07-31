var express=require("express");
var appRouter=express.Router();

var obj =require("../controller/needyController");
const DonorDetails = require("../model/donordetModel");
var {validateToken}=require("../config/validate");

appRouter.post("/profile", validateToken ,obj.doSend); 

appRouter.post("/extract",obj.extractInfoFromImage);

appRouter.post("/find-med",obj.doFind);

appRouter.post("/all-cities", obj.doCity);

appRouter.post("/don-det",obj.doDetails);

appRouter.post("/fetch",obj.doFetch);

appRouter.post("/find-equip",obj.doFetchEquip);



module.exports=appRouter;