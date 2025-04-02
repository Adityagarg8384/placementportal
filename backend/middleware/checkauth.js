const jwt = require("jsonwebtoken");
const userSchema = require("../models/user");

const checkauth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(403).send("Please login first");
        }

        const decode = jwt.verify(token, 'shhh');

        if (!decode) {
            return res.status(401).send("Unauthorized");
        }

        const user = await userSchema.findById(decode.id);

        if (!user) {
            return res.status(404).send("User not found");
        }

        user.password = undefined;

        req.user = user;
        next();
    } catch (err) {
        if (!res.headersSent) {
            return res.status(500).json({
                message: "Some error occurred in check auth",
                success: false,
            });
        }
    }
}

module.exports = checkauth;
