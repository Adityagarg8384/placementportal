const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const postSchema= mongoose.Schema({
    profilepic:{
        type: String
    },
    creatername: {
        type: String,
        ref: "userSchema",
        required: true,
    },
    message: {
        type: String,
    },
    image:{
        type:String,
        default:null
    },
    placeofposting:{
        type:String,
        default:"Undeclared",
    },
    batch:{
        type:[String],
        default:"None",
    },
    Ctc:{
        type:Number,
        default:0
    },
    CGPA:{
        type:Number,
        default:0,
    },
    category:{
        type:String,
    },
    Backlogs:{
        type:Number,
        default:0,
    },
    Branch:{
        type:[String],
    },
    Registrationdate:{
        type: Date,
    },
    Role:{
        type:String,
    },
    Jobdescription:{
        type:String,
    },
    spreadsheetid:{
        type:String,
        required:true,
    }

},
{timestamps:true}
);

const postschema = mongoose.model("postSchema", postSchema);
module.exports = postschema;
