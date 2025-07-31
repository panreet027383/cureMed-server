var UsercolRef = require("../model/userModel");
var jwt = require("jsonwebtoken");

function doSignup(req, resp) 
{
    var userCol = new UsercolRef(req.body);

    userCol.save().then((doc) => 
        {
            let jtoken=jwt.sign({uid:req.body.uid},process.env.SEC_KEY,{expiresIn:"1h"});
            resp.json({ status: true, msg: "Sign Up ", obj: doc , token:jtoken });
        })
        .catch((err) => {
            resp.json({ status: false, msg: err.message });
        });
}

function doLogin(req, resp) {
    UsercolRef.findOne({ uid: req.body.uid , pwd : req.body.pwd})
        .then((doc) => {
        if(doc)     
        {
            let jtoken = jwt.sign( { uid: req.body.uid, ut: doc.ut } , process.env.SEC_KEY, { expiresIn: "1h" });
            resp.json( { status: true , msg: 'Logged in as ' + doc.ut , obj: doc,token: jtoken });
        }
        else
            resp.json({ status: true, msg: "password wrong", obj: doc });
        })
        .catch((err) => {
            resp.json({ status: false, msg: err.message });
        });
}


module.exports = { doSignup, doLogin }