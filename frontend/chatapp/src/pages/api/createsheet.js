import { createspreadsheet } from "@/lib/spreadsheet";

export default async function POST(req, res){
    try{
        const companyname= req?.body?.name;

        const spreadsheetid= await createspreadsheet(companyname);

        if(40==404){
            return res.status(404).json({message:"Some error in receiving id"});
        }
        else{
            return res.status(200).json({message:"Successfully created sheet", data:spreadsheetid});
        }
    }
    catch(err){
        console.log(err);
        return res.status(404).json({message: `Some error occurred ${err}`});
    }
}