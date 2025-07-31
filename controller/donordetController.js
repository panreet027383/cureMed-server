var path = require("path");
var DonorColRef = require("../model/donordetModel")
var cloudinary = require("cloudinary").v2;
// const fs = require('fs');

cloudinary.config(
{ 
    cloud_name: 'ds15fpdo7', 
    api_key: '978835552571367', 
    api_secret: 'w1T7w6eif4rmjZLuhsA7RWyiZoI' // Click 'View API Keys' above to copy your API secret
});

async function doSave(req, resp) {
    let filename1 = " ";
    let filename2 = " ";
    if (req.files.ahdarpic != null) {
        let path1 = path.join(__dirname, "..", "upload", req.files.adharpic.name);
        req.files.adharpic.mv(path1);

        await cloudinary.uploader.upload(path1).then(function (picUrlResult) {
            filename1 = picUrlResult.url;
        });
    }
    else
        filename1 = "none.jpg";
        req.body.adharpic = filename1;

    if (req.files.profilepic != null) {
        let path2 = path.join(__dirname, "..", "upload", req.files.profilepic.name);
        req.files.profilepic.mv(path2);

        await cloudinary.uploader.upload(path2).then(function (picUrlResult) {
            filename2 = picUrlResult.url;
        });
    }
    else
        filename2 = "none.jpg";
        req.body.profilepic = filename2;

    var donorCol = new DonorColRef(req.body);

    donorCol.save().then((doc) => {
        resp.json({ status: true, msg: "Data Saved", obj: doc });
    })
        .catch((err) => {
            resp.json({ status: false, msg: err.message });
        });
}

 async function doUpdate(req,resp)
 {
   let fileName1="";
   let fileName2="";

  
   if(req.files && req.files.adharpic)
         {
            let path1=path.join(__dirname,"..","uploads",req.files.adharpic.name);
            req.files.adharpic.mv(path1);
            

           await cloudinary.uploader.upload(path1).then(function(picUrlResult){
            fileName1 = picUrlResult.url;   
            });
         }
         else
         {
            await DonorColRef.findOne({emailid:req.body.emailid})
            .then(function(docu)
            {
                fileName1 = docu.adharpic; 
            })
            .catch(()=>
            {
                  resp.send({status:false,msg:"PicUrl Error"})
            })
         }

         req.body.adharpic = fileName1;

    if(req.files && req.files.profilepic)
         {
            let path2 = path.join(__dirname,"..","uploads",req.files.profilepic.name);
            req.files.profilepic.mv(path2);
            

           await cloudinary.uploader.upload(path2).then(function(picUrlResult){
            fileName2 = picUrlResult.url;   
            });
         }
         else
         {
            await DonorColRef.findOne({emailid:req.body.emailid})
            .then(function(docu)
            {
                fileName2 = docu.profilepic; 
            })
            .catch(()=>
            {
                  resp.send({status:false,msg:"PicUrl Error"})
            })
         }

         req.body.profilepic=fileName2;

        await DonorColRef.updateOne( {emailid:req.body.emailid} , {$set:req.body} , { upsert: true } )
        .then((docu)=>
        {
           resp.json({status:true,msg:"Record Updated",obj:docu});           
        })
        .catch((err)=>
        {
            resp.json({status:false,msg:err.message});
        })
    
 }
async function doFind(req, resp) {
    const email = req.body.emailid;
    if (!email) {
        return resp.json({ status: false, msg: "Email ID required" });
    }

    try {
        const doc = await DonorColRef.findOne({ emailid: email });
        if (doc) {
            resp.json({ status: true, msg: "Data Found", obj: doc });
        } else {
            resp.json({ status: false, msg: "No record found" });
        }
    } catch (err) {
        resp.json({ status: false, msg: err.message });
    }
}

module.exports = { doSave , doUpdate ,doFind }