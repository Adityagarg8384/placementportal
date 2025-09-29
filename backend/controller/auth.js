const userSchema = require("../models/user");
const recruiterSchema = require("../models/recruiter");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
    try {
        const { username, fullname, password, student } = req.body;

        if (!username || !fullname || !password) {
            return res.status(400).json("Please provide all necessary fields");
        }

        let existingUser

        if (student == true) {
            existingUser = await userSchema.findOne({ username });
        }
        else {
            existingUser = await recruiterSchema.findOne({ username });
        }

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this username', status: 400 });
        }

        const encryptedPassword = await bcrypt.hash(password, 8);
        const avatar = `https://avatar.iran.liara.run/public/boy?username=${username}`;

        let user
        if (student == true) {
            user = await userSchema.create({
                fullname: fullname,
                username: username,
                password: encryptedPassword,
                profilepic: avatar,
            });
        }
        else {
            user = await recruiterSchema.create({
                fullname: fullname,
                username: username,
                password: encryptedPassword,
                profilepic: avatar,
            });
        }

        const token = jwt.sign(
            { id: user._id, username, role: student == true ? "student" : "recruiter" },
            'shhh', // Change this to your actual secret key
            {
                expiresIn: "2h",
            }
        );

        const options = {
            httpOnly: true,
            secure: true,       // important for cross-origin
            sameSite: 'None',   // must be None for cross-site cookies
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
        };

        res.cookie("token", token, options);

        user.password = undefined;

        return res.status(200).json({
            success: true,
            token,
            user,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            status: 400,
            message: "Internal server error",
        });
    }
};

const login = async (req, res) => {
    try {
        const { username, password, student } = req.body;

        if (!username || !password) {
            return res.status(400).send("Please provide both username and password");
        }

        let user;
        if (student == true) {
            user = await userSchema.findOne({ username });
        }
        else {
            user = await recruiterSchema.findOne({ username });
        }
        // const user = await userSchema.findOne({ username });


        if (user == null) {
            return res.status(404).json({ message: "No such user exists", status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(404).json({ message: "Incorrect Password", status: 404 });
        }

        const token = jwt.sign(
            { id: user._id, role: student == true ? "student" : "recruiter" },
            'shhh', // Change this to your actual secret key
            {
                expiresIn: "2h",
            }
        );

        const options = {
            httpOnly: true,
            secure: true,       // important for cross-origin
            sameSite: 'None',   // must be None for cross-site cookies
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days

        };

        // res.cookie("token", token, options);

        user.password = undefined;

        return res.status(200).cookie("token", token, options).json({
            message: "Success",
            status: 200,
            success: true,
            token,
            user,
        });

    } catch (err) {
        return res.status(404).json({
            success: false,
            status: 404,
            message: "Internal server error",
        });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });
        return res.status(200).json({ message: "Logged Out successfully" });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Some error occurred while logging out",
        });
    }
};

module.exports = { signup, login, logout };
