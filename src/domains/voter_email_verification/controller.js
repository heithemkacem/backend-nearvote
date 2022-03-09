const VoterVerification = require('./model')
const Voter = require('./../voter/model')
const hashData = require('./../../util/hashData')
const verifyHashedData = require('./../../util/verifyHashedData')
const sendEmail = require('./../../util/sendEmail')
const {v4: uuidv4}= require('uuid')

const sendVoterVerificationEmail = async ({_id,email},id)=>{
    try{
    //url to be used in the email 
    const currentUrl= "http://localhost:5000/"
    const uniqueString= uuidv4() + _id
    const mailOptions={
        from : process.env.AUTH_EMAIL,
        to: email,
        subject:"Verify Your Email",
        html:`<p>Verify your email adresse to login into your account </p> <p>this link <b> expiresin 24 hours</b> </p><p>Press <a href=${ currentUrl +"voter_email_verification/verify/" + _id + "/" + uniqueString}>HERE</a>to procced</p>`
    }
    await Voter.updateOne({_id},{voteroom_id:id})
    //hash the unique string
    const hashedUniqueString= await hashData(uniqueString)
    //set values in userVerification collection
    const VoterVerificationa= new VoterVerification({
            uniqueId:_id,
            uniqueString:hashedUniqueString,
            createdAt:Date.now(),
            expiresAt:Date.now()+ 86400000,
    })
    await VoterVerificationa.save()
    await sendEmail(mailOptions)
    return{
        userId:_id,
        email:email,
    }
    }
    catch(error) {
        throw error
    }
}
const verifyVoterEmail = async ({uniqueId,uniqueString})=>{
    try{
    
        const existingRecord = await VoterVerification.find({uniqueId})
        if(existingRecord.length>0){
            //todo User Verification Record Exist So We Procced
            const {expiresAt}= existingRecord[0]
            const hashedUniqueString=existingRecord[0].uniqueString
            if(expiresAt < Date.now()){
                //!Record has expired
                await VoterVerification.deleteOne({uniqueId})
                await VoterVerification.deleteOne({_id:uniqueId})
                let message="Link Has Expired,Please Signup Again"
                return redirect(`/voter_email_verification/verified/error=true&message=${message}`)
            }else{
                //!Valid record exist
                //?Comparing the unique string
                const matchString = await verifyHashedData(uniqueString,hashedUniqueString)
                //todo Strings match
                if(matchString){ 
                    await Voter.updateOne({_id:uniqueId},{verified:true})
              
                    await VoterVerification.deleteOne({uniqueId})
                }else{
                    throw Error("Invalid Verification Details Passed")
                }
            }
        }else{
            throw Error("Account Reccord Doesnt Exist Signup Or Login")
        }
    
    }
    catch(error){
        throw error
    }
}
module.exports ={sendVoterVerificationEmail,verifyVoterEmail}