const mongoose= require("mongoose");
const { isNullOrUndefined } = require("util");

const userSchema= new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required: true,
        minlength: 6,
    },
    profilepic:{
        type: String,
        default:null
    },
    token:{
        type: String,
        default:null,
    },
    Age:{
        type:Number,
        default:-1,
    },
    Bloodgroup:{
        type:String,
        default:null,
    },
    tenthpercent:{
        type:Number,
        default:0,
    },
    twelthpercent:{
        type:Number,
        default:0,
    },
    dob:{
        type:Date,
        default:null,
    },
    gender:{
        type:String,
        default:null,
    },
    branch:{
        type:String,
        defualt:"",
    },
    batch:{
        type:String,
        default:null,
    },
    degree:{
        type:String,
        default:null,
    },
    sem1cgpa:{
        type:Number,
        default:0,
    },
    sem2cgpa:{
        type:Number,
        default:0,
    },
    sem3cgpa:{
        type:Number,
        default:0,
    },
    sem4cgpa:{
        type:Number,
        default:0,
    },
    sem5cgpa:{
        type:Number,
        default:0,
    },
    sem6cgpa:{
        type:Number,
        default:0,
    },
    sem7cgpa:{
        type:Number,
        default:0,
    },
    sem8cgpa:{
        type:Number,
        default:0,
    },
    collegename:{
        type:String,
        default:null,
    },
    emailid:{
        type:String,
        default:null,
    },
    phonenumber:{
        type:String,
        default:null
    },
    about:{
        type:String,
        default:null,
    },
    pdfid:{
        type:String,
        default:null,
    },
    post:[{
        type: mongoose.Schema.Types.ObjectId, ref: "postSchema"
    }],
    jobapplied:[{
        type:mongoose.Schema.Types.ObjectId, ref:"postSchema",
    }]
}, {timestamps:true})

const userschema= mongoose.model("userSchema", userSchema);
module.exports=userschema;