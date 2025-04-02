const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profilepic: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: null,
    },
    Age: {
        type: Number,
        default: -1,
    },
    dob: {
        type: Date,
        default: null,
    },
    gender: {
        type: String,
        default: null,
    },
    companyname:{
        type:String,
        default:"None",
    },
    position:{
        type:String,
        default:"None",
    },
    emailid: {
        type: String,
        default: null,
    },
    phonenumber: {
        type: String,
        default: null
    },
    about: {
        type: String,
        default: null,
    },
    post: [{
        type: mongoose.Schema.Types.ObjectId, ref: "postSchema"
    }],
})

const recruiterschema= mongoose.model("recruiterSchema", recruiterSchema);
module.exports=recruiterschema;