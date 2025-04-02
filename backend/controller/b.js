const {google}= require('googleapis');
require("dotenv").config();
const fs= require("fs")
const path= require("path")
const dbconnect = require("./config/database");
import { revalidatePath } from "next/cache";
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

export async function POST(request) {
    try{
        await dbconnect();
        const formData = await request.formData();

        revalidatePath("/uploadpdf")
    }
    catch(err){
        console.log(err);
    }
}