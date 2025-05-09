import { google } from "googleapis";
import stream from "stream";
import zlib from "zlib"
import fs from "fs";

const KEYFILEPATH = "tnpportal-65864e4ee570.json";
const SCOPES = ["https://www.googleapis.com/auth/drive"];

// const auth = new google.auth.GoogleAuth({
//     keyFile: KEYFILEPATH,
//     scopes: SCOPES,
// });

const CLIENTID = process.env.CLIENTID
const CLIENTSECRET = process.env.CLIENTSECRET
const REDIRECTURL = process.env.REDIRECTURL
const REFRESHTOKEN = process.env.REFRESHTOKEN

const oauth2Client = new google.auth.OAuth2(
    CLIENTID,
    CLIENTSECRET,
    REDIRECTURL,
)

oauth2Client.setCredentials({ refresh_token: REFRESHTOKEN })


export const uploadfiletodrive = async (pdfbuffer, pdfname) => {
    return new Promise(async (resolve, reject) => {
        try {
            // const auth = new google.auth.GoogleAuth({
            //     keyFile: KEYFILEPATH,
            //     scopes: SCOPES,
            // });
            const auth = new google.auth.GoogleAuth({
                credentials: {
                    "type": "service_account",
                    "project_id": "tnpportal",
                    "private_key_id": process.env.PRIVATE_KEY_ID,
                    "private_key": process.env.PRIVATE_KEY.split(String.raw`\n`).join('\n'),
                    "client_email": process.env.CLIENT_EMAIL,
                    "client_id": process.env.CLIENT_ID,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                    "client_x509_cert_url": process.env.CLIENT_CERT_URL,
                    "universe_domain": "googleapis.com"
                },
                scopes: SCOPES,
            });

            const drive = google.drive({ version: "v3", auth });
            // const drive = google.drive({ version: "v3", auth: oauth2Client, params: { "key": process.env.CLOUDAPIKEY } });
            // console.log(formData)
            // console.log(req.file.buffer)
            // const pdf= req.file;

            const folderId = "1fyU296_ssLOh-ln2iT5sPKt_zHqOsoiH"


            // const folder = await drive.files.list({
            //     q: `mimeType='application/vnd.google-apps.folder' and name ='pdfupload'`,
            //     fields: "files(id,name)"
            // })

            // if (!folder?.data?.files?.length) {
            //     return res.status(404).json("File not found");
            // }

            // const folderId = folder?.data?.files[0].id;


            const bufferStream = new stream.PassThrough();
            bufferStream.end(Buffer.from(pdfbuffer));

            const upload = await drive.files.create({
                requestBody: {
                    name: pdfname,
                    mimeType: "application/pdf",
                    parents: [folderId],
                },
                media: {
                    mimeType: "application/pdf",
                    body: bufferStream,
                },
                fields: 'id, name',
            })

            if (!upload) {
                return res.status(404).json("Upload failed in backend")
            }

            await drive.permissions.create({
                fileId: upload?.data?.id,
                requestBody: {
                    role: "reader",
                    type: "anyone"
                },
            });
            // console.log(upload.data.id);
            resolve(upload.data.id);
            // return res.send(upload.data.id);
        }
        catch (err) {
            console.log("Error in upload files", err?.message);
            resolve();
            return null;
        }
    })
}

export const deletefilefromdrive = async (pdfid) => {
    try {
        // console.log("Hello world");
        // const drive = google.drive({ version: "v3", auth: oauth2Client, params: { "key": process.env.CLOUDAPIKEY } });
        // console.log(drive);
        // const auth = new google.auth.GoogleAuth({
        //     keyFile: KEYFILEPATH,
        //     scopes: SCOPES,
        // });

        const auth = new google.auth.GoogleAuth({
            credentials: {
                "type": "service_account",
                "project_id": "tnpportal",
                "private_key_id": process.env.PRIVATE_KEY_ID,
                "private_key": process.env.PRIVATE_KEY.split(String.raw`\n`).join('\n'),
                "client_email": process.env.CLIENT_EMAIL,
                "client_id": process.env.CLIENT_ID,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": process.env.CLIENT_CERT_URL,
                "universe_domain": "googleapis.com"
            },
            scopes: SCOPES,
        });

        const drive = google.drive({ version: "v3", auth });
        // const drive = google.drive({ version: "v3", auth: oauth2Client, params: { "key": process.env.CLOUDAPIKEY } });
        // console.log(formData)
        // console.log(req.file.buffer)
        // const pdf= req.file;

        const folderId = "1fyU296_ssLOh-ln2iT5sPKt_zHqOsoiH"
        await drive.files.delete({ fileId: pdfid });

        return 200;

    }
    catch (err) {
        console.log("Error in deleting file : ", err);
        return 404;
    }
}

export const downloadpdf = async (pdfid) => {
    try {
        // const drive = google.drive({
        //     version: 'v3',
        //     auth: oauth2Client,
        //     params: { key: process.env.CLOUDAPIKEY }
        // });
        // const auth = new google.auth.GoogleAuth({
        //     keyFile: KEYFILEPATH,
        //     scopes: SCOPES,
        // });

        const auth = new google.auth.GoogleAuth({
            credentials: {
                "type": "service_account",
                "project_id": "tnpportal",
                "private_key_id": process.env.PRIVATE_KEY_ID,
                "private_key": process.env.PRIVATE_KEY.split(String.raw`\n`).join('\n'),
                "client_email": process.env.CLIENT_EMAIL,
                "client_id": process.env.CLIENT_ID,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": process.env.CLIENT_CERT_URL,
                "universe_domain": "googleapis.com"
            },
            scopes: SCOPES,
        });

        const drive = google.drive({ version: "v3", auth });
        // const drive = google.drive({ version: "v3", auth: oauth2Client, params: { "key": process.env.CLOUDAPIKEY } });
        // console.log(formData)
        // console.log(req.file.buffer)
        // const pdf= req.file;

        const folderId = "1fyU296_ssLOh-ln2iT5sPKt_zHqOsoiH"

        console.log(pdfid);

        const response = await drive.files.get(
            {
                fileId: pdfid,
                alt: 'media'
            },
            { responseType: 'stream' }
        );

        // console.log('Response Status:', response.status);
        // console.log('Response Headers:', response.headers);
        // console.log('Response data : ', response.data);

        // const gunzip = zlib.createGunzip();
        // const decompressedStream = response.data.pipe(gunzip);

        // Return the decompressed stream
        return response?.data;

    }
    catch (err) {
        console.error('Error downloading PDF:', err?.response ? err?.response?.data : err?.message); // Improved error logging
        return 404;
    }
};