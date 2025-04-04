const mongoose=require("mongoose");
require("dotenv").config();

const PORTURL=process.env.PORTURL

const dbconnect= ()=>{
    // console.log(PORTURL)
    // mongoose.connect("mongodb://localhost:27017").then(()=>{
    //     console.log("connected to databse");
    // })
    // .catch((err)=>{
    //     console.log(err);
    //     console.log("Some error occurred");
    // })
   
    mongoose.connect(PORTURL).then(()=>{
        console.log("connected to databse");
    })
    .catch((err)=>{
        console.log(err);
        console.log("Some error occurred");
    })
}

module.exports= dbconnect;