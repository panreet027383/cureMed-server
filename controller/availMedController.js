var path = require("path");
var MedicineColRef = require("../model/availMedModel")
var EquipColRef = require("../model/availEquipModel")
var cloudinary = require("cloudinary").v2;
// const fs = require('fs');

cloudinary.config(
{ 
    cloud_name: 'ds15fpdo7', 
    api_key: '978835552571367', 
    api_secret: 'w1T7w6eif4rmjZLuhsA7RWyiZoI' // Click 'View API Keys' above to copy your API secret
});

function doSaveMed(req,resp)
{
    var MedCol = new MedicineColRef(req.body);

    MedCol.save().then((doc) => 
        {
        resp.json({ status: true, msg: "Saved Sucessfully", obj: doc });
        })
        .catch((err) => {
            resp.json({ status: false, msg: err.message });
        });
}
function doUpdateMed(req,resp)
{
    let emailid = req.body.emailid;
    MedicineColRef.updateOne({ emailid  } , { $set :  req.body  })
        .then((doc)=>{
                resp.json({ status: true, msg: "Medicine successfully updated",obj:doc });
        }).catch((err)=>{
            resp.json({ status: false, msg: err.message });
        }); 
}
function doFetch(req,resp)
{
    const { emailid } = req.body;
    MedicineColRef.find({ emailid })
    .then((doc) => 
        {
        resp.json({ status: true, msg: "Show Medicines", obj: doc });
        })
        .catch((err) => {
            resp.json({ status: false, msg: err.message });
        });
}

function doDelete(req,resp)
{
    const { emailid ,id } = req.body;

    MedicineColRef.deleteOne({ _id : id , emailid })
    .then((doc) => {
        if (doc.deletedCount === 0) {
        resp.json({ status: false, msg: "No matching medicine found to delete." });
      } else {
        resp.json({ status: true, msg: "Medicine deleted successfully.", obj: doc });
      }
        })
        .catch((err) => {
            resp.json({ status: false, msg: err.message });
        });
}
async function doSaveEquip(req,resp)
{
    let filename2 = " ";
    if (req.files.profilepic != null) {
            let path2 = path.join(__dirname, "..", "uploads", req.files.profilepic.name);
            req.files.profilepic.mv(path2);
    
            await cloudinary.uploader.upload(path2).then(function (picUrlResult) {
                filename2 = picUrlResult.url;
            });
        }
        else
            filename2 = "none.jpg";
            req.body.profilepic = filename2;

    var EquipCol = new EquipColRef(req.body);
    EquipCol.save().then((doc) => 
        {
        resp.json({ status: true, msg: "Saved Data Sucessfully", obj: doc });
        })
        .catch((err) => {
            resp.json({ status: false, msg: err.message });
        });
}
async function doUpdateEquip(req,resp)
{
    let fileName2="";
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
        await EquipColRef.findOne({emailid:req.body.emailid})
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
    
            await EquipColRef.updateOne( {emailid:req.body.emailid} , {$set:req.body} , { upsert: true } )
            .then((docu)=>
            {
               resp.json({status:true,msg:"Record Updated",obj:docu});           
            })
            .catch((err)=>
            {
                resp.json({status:false,msg:err.message});
            })
}
function doFind(req,resp)
{
    const { emailid } = req.body;
    EquipColRef.findOne({ emailid })
.then((doc) => {
    if (doc) {
        resp.json({ status: true, msg: "Equipment found", obj: doc });
    } else {
        resp.json({ status: false, msg: "No equipment found." });
    }
})
.catch((err) => {
    resp.json({ status: false, msg: err.message });
});

}
module.exports = { doSaveMed , doUpdateMed , doFetch ,doDelete , doSaveEquip , doUpdateEquip ,doFind}