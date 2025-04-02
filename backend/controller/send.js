const chat = require("../models/chat");
const text = require("../models/text");

const sendmessage = async (req, res) => {
    try {
        const message = req.body.message;
        const receiverid = req.params.id;
        const senderid = req.user._id;

        if (!message) {
            return res.status(400).send("Please type something");
        }
        if (!receiverid) {
            return res.status(400).send("Receiver ID not found");
        }
        if (!senderid) {
            return res.status(400).send("Sender ID not found");
        }

        const newtext = await text.create({ senderid, receiverid, message });

        if (!newtext) {
            return res.status(500).send("Failed to create the message");
        }

        let oldchat = await chat.findOne({
            participants: { $all: [senderid, receiverid] },
        });

        if (!oldchat) {
            oldchat = await chat.create({ participants: [senderid, receiverid], message: [newtext._id] });
        } else {
            // console.log(newtext);
            oldchat.messages.push(newtext._id);
            await oldchat.save();
        }

        return res.status(200).json({
            success: true,
            message: newtext,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const receivemessage = async (req, res) => {
    try {
        const receiverid = req.params.id;
        const senderid = req.user._id.toString(); // Ensure senderid is a string

        const oldchat = await chat.findOne({
            participants: { $all: [senderid, receiverid] }
        }).populate('messages');

        if (!oldchat) {
            return res.status(404).send("No chat found between the participants");
        }

        return res.status(200).json(oldchat.messages);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error in receiving message",
        });
    }
};

module.exports = { sendmessage, receivemessage };