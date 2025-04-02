const nodemailer= require("nodemailer");
dotenv.config();

const transporter= nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    secure:false,
    auth:{
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
    }
})

const sendemail= async(req, res)=>{
    try{
        const {name, email, subject, message}= req.body;
        let mailoptions={
            from:`"${name}" <${process.env.SMTP_MAIL}>`,
            to:process.env.SMTP_MAIL,
            subject:subject,
            text:message,
        }
        await transporter.sendMail(mailoptions);
    }
    catch(err){
        console.log(err);
    }
    

}