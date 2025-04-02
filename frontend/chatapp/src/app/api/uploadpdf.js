import {google} from "googleapis"
import { revalidatePath } from "next/cache";
import formidable from "formidable-serverless"
// import stream from "stream";
// import { CustomError } from "@/utils/customError";
export const config = {
    untime: 'experimental-edge' ,
    api: {
        bodyParser: false,
    },
};

export default async function POST(request) {
    try{
        const pdf= request.formData();
        // const formData = await request.formData();
        // console.log(formData)
        // const pdf= await formData.get("File");

        // if(!pdf){
        //     return ;
        // }

        // const pdfbuffer= pdf.arrayBuffer();


        revalidatePath("/uploadpdf")
    }
    catch(err){
        console.log(err);
    }
}
