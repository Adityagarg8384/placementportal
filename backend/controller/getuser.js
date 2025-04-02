const userSchema = require("../models/user");
const mongoose= require("mongoose");

const getuser = async (req, res) => {
    try {
        const id = req.user._id;

        const filtereduser = await userSchema.find({ _id: { $ne: id } });


        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            body: filtereduser,
        });
    } catch (err) {
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: "Unable to retrieve users",
            });
        }
    }
}

const getspecificuser= async(req, res)=>{
    try{
        const id= req.user._id;

        const data= await userSchema.findById(id).lean();


        if(!data){
            return res.status(400).json({message:"No such user exists"});
        }
        res.status(200).json({data: data});
        
    }
    catch(err){
        return res.status(404).json({message: err});
    }
}

const getuserpost = async (req, res) => {
    try {
        const id = req.params._id;

        // Assuming userSchema is the Mongoose model for users
        const user = await userSchema.findById(id).populate('post');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Extract posts from the user object
        const userPosts = user.post;

        res.status(200).json({ posts: userPosts });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching user posts' });
    }
}

const updateuser = async (req, res) => {
    try {
        const id = req.params._id;
        const data = req.body;

        // Remove keys with empty string values
        const filteredData = Object.fromEntries(
            Object.entries(data).filter(([key, value]) => value !== "")
        );

        if (Object.keys(filteredData).length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }

        const updateuser = await userSchema.updateOne(
            { _id: id },
            { $set: filteredData },
            { runValidators: true }
        );

        if (updateuser.nModified === 0) {
            return res.status(404).json({ message: 'User not found or no fields to update' });
        }
        const filtereduser= await userSchema.findById(id).lean();

        // const filtereduser = await userSchema.find({ _id: { $ne: objectId } });

        return res.status(200).json({message:"Success in updating user", data:filtereduser, status:200});
    }
    catch (err) {
        return res.status(404).send({message:"Error occured"});
    }
}

const removejobapplied= async(req, res)=>{
    try{
        const userid= req.body.userid;
        const jobid= req.body.jobid;
        const updateUser= await userSchema.findByIdAndUpdate(
            userid,
            {$pull:{jobapplied:jobid}},
            {new:true, runValidators:true},
        );

        if(!updateUser){
            return res.status(500).json({message:"Some error occurred"});
        }

        const filtereduser= await userSchema.findById(userid).lean();
        return res.status(200).json({message:"Success", data: filtereduser, status:200});
    }
    catch(err){
        return res.status(404).json({message:"Some error occurred"});
    }
}


module.exports = { getuser, getuserpost, updateuser, getspecificuser, removejobapplied };
