import { deletespreadsheet } from "@/lib/spreadsheet";

export default async function POST(req, res){
    try{
        const spreadsheetid= req?.body?.spreadsheetid;
        const userid= req?.body?.userid;

        const re= await deletespreadsheet(spreadsheetid, userid);

        if(re!=200){
            return res.status(404).json({message:"Some error occurred"});
        }
        return res.status(200).json({message:"Success"});
    }
    catch(err){
        console.log(err);
        return res.status(404).json({message:"Some error occurred while deleting data"});
    }
}