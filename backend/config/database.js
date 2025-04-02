const mongoose=require("mongoose");

const dbconnect= ()=>{
    mongoose.connect("mongodb://localhost:27017").then(()=>{
        console.log("connected to databse");
    })
    .catch((err)=>{
        console.log(err);
        console.log("Some error occurred");
    })
}

module.exports= dbconnect;