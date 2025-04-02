const multer= require("multer")

const storage = multer.memoryStorage();
const upload = multer({ storage });

const pdfmiddleware= async(req,res,next)=>{
    upload.single('file');
    next();
}

module.exports={pdfmiddleware}