const {recruiterchat} = require("../models/chat");
const {recruitertext} = require("../models/text");
const userSchema = require("../models/user");
const recruiterSchema= require("../models/recruiter");

const sendrecruitermessage = async (req, res) => {
    try {
        
        const message = req.body.message;
        const receiverid = req.params.id;
        let senderid;
        // console.log("Sender id is ",req.user);
        // console.log("Sender id is ",req.recruiter);
        if(req.recruiter===undefined){
            
            senderid = req.user.id;
        }
        else{
            
            senderid = req.recruiter.id;
        }
        

        console.log(receiverid, senderid, message);

        if (!message) {
            return res.status(400).send("Please type something");
        }
        if (!receiverid) {
            return res.status(400).send("Receiver ID not found");
        }
        if (!senderid) {
            return res.status(400).send("Sender ID not found");
        }
        console.log("Hello world");
        const newtext = await recruitertext.create({ senderid, receiverid, message });
        console.log("Newtext is ", newtext);

        if (!newtext) {
            return res.status(500).send("Failed to create the message");
        }

        // let oldchat = await chat.findOne({
        //     participants: { $all: [senderid, receiverid] },
        // });
        let oldchat = await recruiterchat.findOne({
            $or: [
              { participant1: senderid, participant2: receiverid },
              { participant1: receiverid, participant2: senderid }
            ]
          });


        if (!oldchat) {
            console.log("Cannot find previouschat in send chat");
            oldchat = await recruiterchat.create({
                participant1: senderid,
                participant2: receiverid,
              });
            // oldchat = await chat.create({ participants: [senderid, receiverid], message: [newtext._id] });
        } else {
            // console.log(newtext);
            console.log("find previouschat in send chat");
            oldchat.messages.push(newtext._id);
            await oldchat.save();
        }

        return res.status(200).json({
            success: true,
            message: newtext,
        });
    } catch (err) {
        console.log("Error is " ,err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const receiverecruitermessage = async (req, res) => {
    try {
        console.log("Currently in recieverecruitermessage");
        const receiverid = req.params.id;
        // console.log("Sender id at receiver is ", req.recruiter);
        let senderid 

        // console.log("Sender id is ",req.user);
        // console.log("Sender id is ",req.recruiter);
        if(req.recruiter===undefined){
            
            senderid = req.user._id.toString();
        }
        else{
            
            senderid = req.recruiter._id.toString();
        }

        // const oldchat = await chat.findOne({
        //     participants: { $all: [senderid, receiverid] }
        // }).populate('messages');

        // if (!oldchat) {
        //     return res.status(404).send("No chat found between the participants");
        // }

        const oldchat = await recruiterchat.findOne({
            $or: [
              { participant1: senderid, participant2: receiverid },
              { participant1: receiverid, participant2: senderid }
            ]
          }).populate('messages');
        if (!oldchat) {
            console.log("Cannot find previous chat in receiver");
            return res.status(404).send("No chat found between the participants");
        }
        else{
            console.log("find previous chat in receiver");
        }

        // console.log("Old chat messages are ", oldchat);

        return res.status(200).json(oldchat.messages);
    } catch (err) {
        console.log("Error is ", err);
        return res.status(500).json({
            success: false,
            message: "Error in receiving message",
        });
    }
};

module.exports = { sendrecruitermessage, receiverecruitermessage };