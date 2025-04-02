const express = require("express");
const { sendmessage, receivemessage } = require("../controller/send");
const { signup, login, logout } = require("../controller/auth");
const checkauth = require("../middleware/checkauth");
const {getuser,getuserpost, updateuser} = require("../controller/getuser");

const router = express.Router();

// router.post("/send/:id", checkauth, sendmessage);
// router.get("/:id", checkauth, receivemessage);
router.post("/signup", signup);
router.post("/login", login);
// router.get("/getuser", checkauth,()=>{
//     console.log("Check auth successful");
// });
router.post("/logout", logout);

module.exports = router;
