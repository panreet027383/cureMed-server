var express=require("express");
var appRouter=express.Router();

var obj =require("../controller/userController")
// var {validateToken}=require("../config/validate");

appRouter.post("/signup",obj.doSignup);

appRouter.post("/login" , obj.doLogin);

module.exports=appRouter;