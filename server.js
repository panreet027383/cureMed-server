var express= require("express");
const cors = require('cors');
const fileUpload = require("express-fileupload");
var dotenv = require("dotenv");
dotenv.config();
console.log(process.env.SEC_KEY);
var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload()); 


var userRouter = require("./router/userRouter");
var donordetRouter = require("./router/donordetRouter");
var availMedRouter = require("./router/availMedRouter");
var needyRouter = require("./router/needyRouter");


let mongoose=require("mongoose");

let mongodbAtlasUrl = "mongodb+srv://parneet2068:P123arn@cluster0.05udkrs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongodbAtlasUrl)
.then(()=>{
    console.log("Connected Successfully");
})
.catch((err)=>{
    console.log(err.message);
});

app.listen(2003,()=>{
    console.log("Server Started at 2003..");
});


app.use("/user", userRouter);

app.use("/donor", donordetRouter );

app.use("/medicine",availMedRouter);

app.use("/needy",needyRouter);