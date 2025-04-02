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

const chat = mongoose.model("chat", chats);
module.exports = chat;