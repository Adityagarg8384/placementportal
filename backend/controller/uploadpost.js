const postSchema = require("../models/posts");
const userSchema = require("../models/user");
const cloudinary = require("cloudinary").v2;
const { createCanvas } = require('canvas');

cloudinary.config({
    cloud_name: "dw8nua855",
    api_key: "931883421199481",
    api_secret: "C8dDjUaX0wZU3htgTq-gaREkh2E",
});

const upload = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        
        res.status(200).json({ message: "Image uploaded successfully", result });
    } catch (err) {
        res.status(500).json({ error: "Error uploading image" });
    }
};

const generateimage = (companyname) => {
    try {
      const width = 800;
      const height = 400;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');
  
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
  
      const baseFontSize = Math.floor(height / 2); 
      const fontSize = Math.min(baseFontSize, width / companyname.length * 1.5); 
  
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle'; 

      ctx.fillText(companyname.charAt(0).toUpperCase(), width / 2, height / 2);

      return canvas.toDataURL('image/png');
    } catch (err) {
      console.error("Error generating image:", err);
      return;
    }
  };

const createpost = async (req, res) => {
    try {
        const { userid, profilepic, creatername, message, image,Branch, placeofposting, batch, Ctc, CGPA, category, Backlogs, Registrationdate, Jobdescription, spreadsheetid, Role } = req.body;
        const batchonly = batch
        const Branchonly= Branch

        const base64Image = generateimage(creatername);

        const post = await postSchema.create({
            profilepic: profilepic,
            creatername: creatername,
            message: message,
            image: base64Image, 
            placeofposting: placeofposting,
            batch: batchonly,
            Ctc: Ctc,
            CGPA: CGPA,
            category: category,
            Backlogs: Backlogs,
            Branch: Branchonly,
            Registrationdate:Registrationdate,
            Jobdescription:Jobdescription,
            spreadsheetid: spreadsheetid,
            Role:Role
        });

        const user = await userSchema.findByIdAndUpdate(
            userid,
            { $push: { post: post._id } },
            { new: true }
        );

        res.status(200).json({ message: "Post created successfully", post, user });

    } catch (err) {
        res.status(500).json({ error: "Error creating post" , err });
    }
};

const getallpost= async(req, res)=>{
    try {
        const posts = await postSchema.find();

        res.status(200).json({ posts });
    } catch (err) {
        res.status(500).json({ error: "Error fetching posts" });
    }
}

const getpost= async(req, res)=>{
    try{
        const postid= req.params.id;
        const posts= await postSchema.findById(postid);
        if(posts){
            res.status(200).json(posts);
        }
        else{
            return res.status(404).json({message:"Post cannot be created"});s
        }
    }
    catch(err){
        return res.status(404).json({message:"Some error occurred"});
    }
}

module.exports = { upload, createpost, getallpost, getpost };
