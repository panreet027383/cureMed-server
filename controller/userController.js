var UsercolRef = require("../model/userModel");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


async function doSignup(req, resp) 
{
    const { uid , pwd ,ut } = req.body;
    // const existingUser = await UserColRef.findOne({ uid });
    //         if (existingUser) {
    //         return resp.json({ status: false, msg: "User already exists" });
    //     }

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

async function doLogin(req, resp) {
  try {
    const { uid, pwd } = req.body;

    const doc = await UsercolRef.findOne({ uid });

    if (!doc) {
      return resp.json({ status: false, msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(pwd, doc.pwd); // compare plain with hashed
    if (!isMatch) {
      return resp.json({ status: false, msg: "Incorrect password" });
    }

    const jtoken = jwt.sign(
      { uid: doc.uid, ut: doc.ut },
      process.env.SEC_KEY,
      { expiresIn: "1h" }
    );

    resp.json({
      status: true,
      msg: "Logged in as " + doc.ut,
      obj: doc,
      token: jtoken,
    });
  } catch (err) {
    console.error("Login error:", err);
    resp.status(500).json({ status: false, msg: "Server error during login" });
  }
}



module.exports = { doSignup, doLogin }