const mongoose = require("mongoose");
const recruiterSchema = require("../models/recruiter");

const getrecruiter= async (req, res)=>{
    try{
        const recruiters = await recruiterSchema.find();

        // console.log("Recruiters data fetched is", recruiters);
        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            body: recruiters,
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Unable to retrieve Recruiters",
        });
    }
}

const updaterecruiter = async (req, res) => {
    try {
        const id = req.params._id; // Get the recruiter ID from the request parameters
        const data = req.body; // Get the data from the request body

        // Remove keys with empty string values
        const filteredData = Object.fromEntries(
            Object.entries(data).filter(([key, value]) => value !== "")
        );

        if (Object.keys(filteredData).length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }

        // Check if there's a new post to add to the posts array
        if (filteredData.post) {
            // Use $addToSet to add the new post ID to the posts array
            await recruiterSchema.updateOne(
                { _id: id },
                { $addToSet: { post: filteredData.post } },
                { runValidators: true }
            );
            delete filteredData.post; // Remove post from filteredData to avoid updating it again
        }

        // Update other fields
        const updateuser = await recruiterSchema.updateOne(
            { _id: id },
            { $set: filteredData },
            { runValidators: true }
        );

        if (updateuser.nModified === 0) {
            return res.status(404).json({ message: 'User not found or no fields to update' });
        }

        // Fetch the updated recruiter data
        const filtereduser = await recruiterSchema.findById(id).lean();

        return res.status(200).json({ message: "Success in updating user", data: filtereduser, status: 200 });
    } catch (err) {
        console.log(err);
        return res.status(404).send({ message: "Error occurred" });
    }
}


const getspecificrecruiter = async (req, res) => {
    try {
        const id = req.user._id;

        const data = await recruiterSchema.findById(id).lean();

        if (!data) {
            return res.status(400).json({ message: "No such user exists" });
        }
        res.status(200).json({ data: data });

    }
    catch (err) {
        console.log("Some error occurred ", err);
        return res.status(404).json({ message: err });
    }
}

module.exports = { updaterecruiter, getspecificrecruiter, getrecruiter };