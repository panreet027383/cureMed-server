var UsercolRef = require("../model/userModel");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


async function doSignup(req, resp) 
{
    const { uid , pwd ,ut } = req.body;
    const existingUser = await UserColRef.findOne({ uid });
            if (existingUser) {
            return resp.json({ status: false, msg: "User already exists" });
        }

        const saltRounds = 10;
        const hashedPwd = await bcrypt.hash(pwd, saltRounds);

        var userCol = new UsercolRef({ uid , pwd: hashedPwd , ut});

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