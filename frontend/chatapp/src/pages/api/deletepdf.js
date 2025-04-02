import { NextResponse } from 'next/server';
import {deletefilefromdrive} from  "@/lib/googleDrive"



export default async function POST(req, response){
    try{
        const id= req?.body?.id;
        const b=await deletefilefromdrive(id);
        if(b==200){
            return response.status(200).json({message:"Hello world"});
        }
        else if(b==404){
            return response.status(404).json({message:"Some error occurred"});
        }

        
    }
    catch(err){
        return response.status(404).json({message:"Error"});

    }
}