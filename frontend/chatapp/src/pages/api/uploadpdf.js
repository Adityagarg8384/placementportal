"use server";

import { google } from "googleapis"
import { revalidatePath } from "next/cache";
import formidable from "formidable-serverless"
import fs from "fs"
import { uploadfiletodrive } from "@/lib/googleDrive";
import { resolve } from "path";
import { NextResponse } from "next/server";

export const config = {
    untime: 'experimental-edge',
    api: {
        bodyParser: false,
    },
};

export default async function POST(request, response) {
    try {
        const form = new formidable.IncomingForm();

        let ide;
        let filename;

        return new Promise((resolve, reject) => {
            form.parse(request, async (err, fields, files) => {
                if (err) {
                    console.log("Error");
                    return;
                }

                const filename = fields?.filename;
                const file = files?.file;
                const filepath = file?.path;

                try {
                    const fileBuffer = await fs.promises.readFile(filepath);  
                    const id = await uploadfiletodrive(fileBuffer, filename); 
                    
                    response.status(200).send(id);
                    resolve(id);
                } catch (err) {
                    console.error("Error reading file or uploading:", err);
                    response.status(404).send("Some error occurred");
                }
            });
        })
    }
    catch (err) {
        console.log(err);
    }
}
