const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const tex = mongoose.Schema({
    senderid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userSchema",
        required: true,
    },
    receiverid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userSchema",
        required: true,
    },
    message: {
        type: String,
    }
},
{timestamps:true}
);

const recrutiertex= mongoose.Schema({
    senderid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"recruiterSchema",
        required:true,
    },
    receiverid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"userSchema",
        required:true,
    },
    message:{
        type:String,
    }
},
{timestamps:true}
)


const text = mongoose.model("text", tex);
const recruitertext= mongoose.model("recruitertext", recrutiertex);
module.exports = {text, recruitertext};
