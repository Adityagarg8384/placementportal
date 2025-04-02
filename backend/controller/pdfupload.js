const {google}= require('googleapis');
require("dotenv").config();
const fs= require("fs")
const path= require("path")
// import stream from "stream";
// import { CustomError } from "@/utils/customError";

const CLIENTID= process.env.CLIENTID
const CLIENTSECRET= process.env.CLIENTSECRET
const REDIRECTURL= process.env.REDIRECTURL
const REFRESHTOKEN= process.env.REFRESHTOKEN

const oauth2Client= new google.auth.OAuth2(
    CLIENTID,
    CLIENTSECRET,
    REDIRECTURL
)

oauth2Client.setCredentials({refresh_token: REFRESHTOKEN})


const uploadfiletodrive= async(req, res)=>{
    const drive= google.drive({version: "v3",oauth2Client});
    const formData = await req.formData();
    const pdf= formData.get('file');
    // console.log(formData)
    // console.log(req.file.buffer)
    // const pdf= req.file;

    pdfArrayBuffer= pdf.ArrayBuffer();

    try{
        const folder= await drive.files.list({
            q: `mimeType='application/vnd.google-apps.folder' and name ='pdfupload'`,
            fields: "files(id,name)",
        })

        if(!folder.data.files.length){
            return res.status(404).json("File not found");
        }

        const folderId= folder.data.files[0].id;


        const bufferStream= new stream.PassThrough();
        bufferStream.end(Buffer.from(pdfArrayBuffer));


        const upload= await drive.files.create({
            requestBody:{
                name: pdfname,
                mimeType: "application/pdf",
                parents:[folderId],
            },
            media:{
                mimeType: "application/pdf",
                body: bufferStream,
            }
        })

        if(!upload){
            return res.status(404).json("Upload failed in backend")
        }

        await drive.permission.create({
            fileId: upload.data.id,
            requestBody: {
                role: "reader",
                type: "anyone"
            },
        });

        return upload.data.id
    }
    catch(err){
        console.log("Error in upload files", err.message);
        return null;
    }
}

const deletefileupload= async(pdfid)=>{
    try{
        const drive= google.drive({ version: "v3", oauth2Client});
        await drive.files.delete({fileId: pdfid});
        return;
    }
    catch(err){
        console.error("Error deleting files", err.message);
        return null
    }
}

module.exports = { uploadfiletodrive, deletefileupload };