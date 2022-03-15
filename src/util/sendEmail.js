const nodemailer= require('nodemailer')
let transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.AUTH_EMAIL,
        pass:process.env.PASSWORD,
    }
   
})
//testing success
transporter.verify((error,success)=>{
    if(error){
        console.log(error)
    }else{
        console.log("ready to go")
        console.log(success)
    }
})
const sendEmail = async (mailOptions)=>{
    try{
        const emailSent = await transporter.sendMail(mailOptions)
        return emailSent
    }
    catch(error){
        throw error
    }
}
module.exports = sendEmail