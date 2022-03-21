const sendEmail = require('../../util/sendEmail')
const hashData = require('./../../util/hashData')
const PasswordReset= require('./model')
const Org= require('./../org/model')
const {v4: uuidv4}= require('uuid')
const verifyHashedData = require('./../../util/verifyHashedData')

//!Organization
const sendPasswordResetEmail = async ({_id,email},redirectUrl,res) => {
    try{
        const resetString=uuidv4() + _id
        await PasswordReset.deleteMany({uniqueId:_id})
        //reset record deleted succesfuly
        //now we send email
        const mailOptions={
                from : process.env.AUTH_EMAIL,
                to:email,
                subject:"Password Reset",
                html:`<p>lost your password ? use this link to reset </p> <p>this link <b> expiresin 24 hours</b> </p><p>Press <a href=${ redirectUrl +"/" + _id + "/" + resetString}>HERE</a>to procced</p>`
        }
            //hash the reset string
        const hashedResetString = await hashData(resetString)
        
        const newPasswordReset = new PasswordReset({
                uniqueId:_id,
                resetString:hashedResetString,
                createdAt:Date.now(),
                expiresAt:Date.now()+ 86400000,
        })
        await newPasswordReset.save()
        await sendEmail(mailOptions)
        return{
        userId:_id,
        email,
        }
    }
    catch(error){
        throw error
    }    
}

const requestPasswordReset = async ({email,redirectUrl})=>{
    try{
        const existingEmail = await Org.find({email})
            if(existingEmail.length){      
                //?User exist
                //?Check If The Org Is Verifeied    
                if(!existingEmail[0].verified){
                    throw Error("The Organization Is Not Verified To Login")
                }else{
                    sendPasswordResetEmail(existingEmail[0],redirectUrl)
                }
    
            }else{
                throw Error("No Account With That Email Exist")
            }
    }
    catch(error) {
        throw error
    }
}
const resetPassword = async ({uniqueId,resetString,newPassword})=>{
    try{
    const existingRecord = await PasswordReset.find({uniqueId})
        if(existingRecord.length > 0){
            //!Password Reset Record Exist 
            const {expiresAt} = existingRecord[0]
            const hashedResetString = existingRecord[0].resetString
            if(expiresAt < Date.now()){
                await PasswordReset.deleteOne({uniqueId})
                throw Error("Password Record Doesn't Exist")
            }else{
                //valid reset record exist
                const matchString = await verifyHashedData(resetString,hashedResetString)
                if(matchString){
                    //?Hash the new password
                    const hashedNewPassword = await hashData(newPassword)
                    //?Update user password
                    await Org.updateOne({_id : uniqueId},{password : hashedNewPassword})
                    //?Update compeleted now delete reset record
                    await PasswordReset.deleteOne({uniqueId})
                    //?both user and reset record deleted
                    
                           
                }else{
                //?existing record but incorrect reset string record
                    throw Error("invalid password reset details passed ")
                }
            }
        }else{
           throw Error("password request not found")
        }
    }
    catch(error){
        throw error
    }
}
module.exports = {requestPasswordReset,resetPassword}