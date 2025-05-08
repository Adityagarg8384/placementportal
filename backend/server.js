const express = require("express");
const dbconnect = require("./config/database");
const cors = require("cors");
const router = require("./routes/router");
const cookieParser = require("cookie-parser");
const checkauth = require("./middleware/checkauth");
const {getuser, getuserpost, updateuser, getspecificuser, removejobapplied, getalluser} = require("./controller/getuser");
const {sendmessage, receivemessage}= require("./controller/send")
const {upload, createpost, getallpost, getpost}= require("./controller/uploadpost")
const {uploadfiletodrive, deletefileupload}= require("./controller/pdfupload")
const {sendrecruitermessage, receiverecruitermessage}= require("./controller/recruitersend");
const {pdfmiddleware}= require("./middleware/pdfupload")
const {updaterecruiter, getspecificrecruiter, getrecruiter}= require("./controller/recruiter");
const bodyParser= require("body-parser")
const multer= require("multer");
const http= require("http");
const {setupSocket}=require("./socket/socket");


const storage=multer.diskStorage({
    destination: function(req,file, cb){
        return cb(null, "./uploads")
    },
    filename: function(req,file,cb){
        return cb(null, `${Date.now()}- ${file.originalname}`)
    },
})
const upl= multer({storage:storage})

const corsOptions = {
    origin: true,
    credentials: true, // This allows cookies to be sent
  };

const app = express();
const server = http.createServer(app);

const emailtosocketmapping= new Map()
const sockettoemailmapping= new Map();
setupSocket(app, server, emailtosocketmapping, sockettoemailmapping);

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
// app.use(bodyParser)

app.get("/getuser", checkauth,getuser);
app.post("/send/:id", checkauth, sendmessage);
app.get("/receive/:id", checkauth, receivemessage);

app.post("/sendrecruitermessage/:id", checkauth,sendrecruitermessage)
app.get("/receiverecruitermessage/:id", checkauth, receiverecruitermessage)
app.post("/upload",upl.single('image'), upload);
app.post("/createpost", createpost)
app.get("/getallpost", getallpost);
app.get("/getuserpost/:_id", getuserpost)
app.post("/uploadfiletodrive", uploadfiletodrive);
app.put("/updateuser/:_id", updateuser)
app.get("/getspecificuser", checkauth, getspecificuser);
app.put("/removejobapplied",checkauth, removejobapplied);
app.put("/updaterecruiter/:_id", updaterecruiter);
app.get("/getspecificrecruiter", checkauth, getspecificrecruiter);
app.get("/getrecruiter", checkauth, getrecruiter);
app.get("/getalluser", getalluser)
app.get("/getpost/:id", getpost);

app.use("/", router);

dbconnect();

server.listen(3000, () => {
    console.log("App has successfully started on Port 3000");
});
