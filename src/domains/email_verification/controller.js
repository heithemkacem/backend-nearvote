const OrganizationVerification = require('./model')
const Org = require('./../org/model')
const hashData = require('./../../util/hashData')
const verifyHashedData = require('./../../util/verifyHashedData')
const sendEmail = require('./../../util/sendEmail')
const {v4: uuidv4}= require('uuid')

const sendVerificationEmail = async ({_id,email})=>{
    try{
    //url to be used in the email 
    const currentUrl= "http://localhost:7000/"
    const uniqueString= uuidv4() + _id
    const mailOptions={
        from : process.env.AUTH_EMAIL,
        to:email,
        subject:"Verify Your Email",
        html:`<p>Verify your email adresse to complete the signup and login into your account </p> <p>this link <b> expiresin 24 hours</b> </p><p>Press <a href=${ currentUrl +"email_verification/verify/" + _id + "/" + uniqueString}>HERE</a>to procced</p>`
    }
    //hash the unique string
    const hashedUniqueString= await hashData(uniqueString)
    //set values in userVerification collection
    const organizationVerifivation= new OrganizationVerification({
            uniqueId:_id,
            uniqueString:hashedUniqueString,
            createdAt:Date.now(),
            expiresAt:Date.now()+ 86400000,
    })
    await organizationVerifivation.save()
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
const verifyEmail = async ({uniqueId,uniqueString})=>{
    try{
    
        const existingRecord = await OrganizationVerification.find({uniqueId})
        if(existingRecord.length>0){
            //todo User Verification Record Exist So We Procced
            const {expiresAt}= existingRecord[0]
            const hashedUniqueString=existingRecord[0].uniqueString
            if(expiresAt < Date.now()){
                //!Record has expired
                await OrganizationVerification.deleteOne({uniqueId})
                await OrganizationVerification.deleteOne({_id:uniqueId})
                let message="Link Has Expired,Please Signup Again"
                return redirect(`/email_verification/verified/error=true&message=${message}`)
            }else{
                //!Valid record exist
                //?Comparing the unique string
                const matchString = await verifyHashedData(uniqueString,hashedUniqueString)
                //todo Strings match
                if(matchString){ 
                    await Org.updateOne({_id:uniqueId},{verified:true})
                    await OrganizationVerification.deleteOne({uniqueId})
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
module.exports ={sendVerificationEmail,verifyEmail}