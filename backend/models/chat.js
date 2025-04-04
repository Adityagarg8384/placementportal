const { MongoGridFSChunkError } = require("mongodb");
const mongoose = require("mongoose");

const chats = mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema',
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'text',
    }]
},
{timestamps:true});

const recruiterchats= mongoose.Schema({
    // participants: [{
    //     participantId: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         required: true,
    //         refPath: 'participants.participantModel',
    //     },
    //     participantModel: {
    //         type: String,
    //         required: true,
    //         enum: ['recruiterSchema', 'userSchema'],
    //     }
    // }],
    participant1:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"recruiterSchema",
        required:true,
    },
    participant2:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"userSchema",
        required:true,
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "recruitertext",
    }]
}, { timestamps: true });

const chat = mongoose.model("chat", chats);

const recruiterchat= mongoose.model("recruiterchat", recruiterchats);

module.exports = {chat, recruiterchat};