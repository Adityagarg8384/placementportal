import { addspreadsheet } from "@/lib/spreadsheet";

export default async function POST(req, res){
    try{
        const id= req?.body?.id;
        const data= req?.body?.data;

        const response= await addspreadsheet(id, data);

        if(response!=200){
            return res.status(404).json({message: "Some error occurred in adding data"});
        }
        else{
            return res.status(200).json({message:"Data added successfully"});
        }
    }
    catch(err){
        return res.status(400).json({message: "Some error occurred"});
    }
}