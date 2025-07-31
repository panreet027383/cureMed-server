var express=require("express");
var appRouter=express.Router();

var obj =require("../controller/donordetController");
var {validateToken}=require("../config/validate");

appRouter.post("/donordetails/save", validateToken ,obj.doSave);

appRouter.post("/donordetails/update",obj.doUpdate);

appRouter.post("/donordetails/find",obj.doFind);

module.exports=appRouter;