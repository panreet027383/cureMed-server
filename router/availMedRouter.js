var express=require("express");
var appRouter=express.Router();

console.log("📦 availMedRouter loaded");

var obj =require("../controller/availMedController");

appRouter.post("/save",obj.doSaveMed);

appRouter.post("/update",obj.doUpdateMed);

appRouter.post("/fetch", obj.doFetch);

appRouter.post("/delete",obj.doDelete);

appRouter.post("/save/equip", obj.doSaveEquip);

appRouter.post("/update/equip",obj.doUpdateEquip);

appRouter.post("/find",obj.doFind);

module.exports=appRouter;