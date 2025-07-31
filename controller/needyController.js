// const fs = require("fs");
const path = require("path");
const NeedyColRef = require("../model/needyModel");
const cloudinary = require("cloudinary").v2;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyD9m5gDZcryzPiQPVM7PzafTllK31QXYYk");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const DonorDetails = require("../model/donordetModel");
const AvailMedicines = require("../model/availMedModel");
const AvailEquipments = require("../model/availEquipModel");
cloudinary.config({
  cloud_name: "ds15fpdo7",
  api_key: "978835552571367",
  api_secret: "w1T7w6eif4rmjZLuhsA7RWyiZoI",
});


async function RajeshBansalKaChirag(imgurl)
{
  const myprompt = "You are reading an Aadhar card image. Based on whether its the front or back side, return a JSON object. For front side: return JSON like { name:'', gender:'', dob: ''} . For back side: return JSON like {address: ''}.Strictly return only JSON object. No explanation or text." ; 
  const imageResp = await fetch(imgurl)
  .then((response) => response.arrayBuffer());

  const result = await model.generateContent([
        {
            inlineData: {
                data: Buffer.from(imageResp).toString("base64"),
                mimeType: "image/jpeg",
            },
        },
        myprompt,
    ]);
    console.log(result.response.text())
            
            const cleaned = result.response.text().replace(/```json|```/g, '').trim();
            // console.log(cleaned)
            const jsonData = JSON.parse(cleaned);
            // console.log(jsonData);

    return jsonData

}
async function extractInfoFromImage(req, res) {
  try {
    const file = req.files.image;
    const type = req.body.type;

    const tempPath = path.join(__dirname, "..", "upload", file.name);
    await file.mv(tempPath);

    const uploadResult = await cloudinary.uploader.upload(tempPath);

    const extracted = await RajeshBansalKaChirag(uploadResult.url);

    if (type === 'front') {
      res.json({
        status: true,
        name: extracted.name,
        dob: extracted.dob,
        gender: extracted.gender,
      });
    } else if (type === 'back') {
      res.json({
        status: true,
        address: extracted.address,
      });
    } else {
      res.json({ status: false, msg: 'Unknown type' });
    }
  } catch (err) {
    console.error("Extraction failed:", err);
    res.json({ status: false, msg: err.message });
  }
}

async function doSend(req, resp) {
  try {
    const data = {}; // To collect extracted info

    // Handle front Aadhar
    if (req.files.frontadhar) {
      const frontPath = path.join(__dirname, "..", "upload", req.files.frontadhar.name);
      await req.files.frontadhar.mv(frontPath);
      const frontUpload = await cloudinary.uploader.upload(frontPath);
      
      const frontData = await RajeshBansalKaChirag(frontUpload.url);
      req.body.frontadhar = frontUpload.url;
      Object.assign(data, frontData); // Merge name, dob, gender
    }

    // Handle back Aadhar
    if (req.files.backadhar) {
      const backPath = path.join(__dirname, "..", "upload", req.files.backadhar.name);
      await req.files.backadhar.mv(backPath);
      const backUpload = await cloudinary.uploader.upload(backPath);
      const backData = await RajeshBansalKaChirag(backUpload.url);
      req.body.backadhar = backUpload.url ;
      Object.assign(data, backData); // Merge address
    }

    // Save to DB
    const needyCol = new NeedyColRef({ ...req.body, ...data });
    const savedDoc = await needyCol.save();

    // Only one response
    return resp.json({ status: true, msg: "Data Saved", obj: savedDoc });

  } catch (err) {
    console.error("❌ doSend error:", err.message);
    return resp.json({ status: false, msg: err.message });
  }
}
async function doFetch(req,resp)
{
    const emailid = req.body.emailid;
      if (!emailid) {
          return resp.json({ status: false, msg: "Email ID required" });
      }
  
      try {
          const doc = await NeedyColRef.findOne({ emailid: emailid });
          if (doc) {
              resp.json({ status: true, msg: "Data Found", obj: doc });
          } else {
              resp.json({ status: false, msg: "No record found" });
          }
      } catch (err) {
          resp.json({ status: false, msg: err.message });
      }
}
async function doCity(req, resp){
  try {
    const cities = await DonorDetails.distinct("currcity");
    console.log(cities);
    resp.json(cities);
  } catch (err) {
    console.error(err);
    resp.status(500).send("Server error");
  }
}
async function doFind(req,resp)
{
  const { currcity, medicine } = req.body;

  try {
    // Step 1: Get donor emails from that city
    const emails = await DonorDetails.distinct("emailid", { currcity });
    if (emails.length === 0) return resp.json([]);

    // Step 2: Find matching medicine entries
    const meds = await AvailMedicines.find({
      emailid: { $in: emails },
      medicine: { $regex: `^${ medicine }$`, $options: "i" }
    }).lean();

    resp.json(meds);
  } catch (err) {
  resp.status(500).json({ error: "Server error", details: err.message });
  };
}

async function doDetails(req, res) 
{
  const { emailid } = req.body;
      console.log("Received emailid:", req.body.emailid);
  
  try {
    const donor = await DonorDetails.findOne({ emailid }).lean();

    if (!donor) return res.status(404).json({ error: "Donor not found" });

    res.json({
      names: donor.names,
      emailid: donor.emailid,
      curraddress: donor.curraddress,
      currcity: donor.currcity,
      contact : donor.contact,
      profilepic : donor.profilepic,
    });
  } catch (err) {
    // console.error("Error fetching donor:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
async function doFetchEquip(req,resp)
{
  const { currcity, equipmentName } = req.body;

  try {
    // Step 1: Get donor emails from that city
    const emails = await DonorDetails.distinct("emailid", { currcity });
    if (emails.length === 0) return resp.json([]);

    // Step 2: Find matching medicine entries
    const equip = await AvailEquipments.find({
      emailid: { $in: emails },
      equipmentName: { $regex: `^${ equipmentName }$`, $options: "i" }
    }).lean();

    resp.json(equip);
  } catch (err) {
  resp.status(500).json({ error: "Server error", details: err.message });
  };
}

module.exports = {doCity , doSend , extractInfoFromImage , doFetch , doFind ,doDetails , doFetchEquip};
