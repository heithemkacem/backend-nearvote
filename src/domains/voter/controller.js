const Voter = require('./model')
const hashData = require('./../../util/hashData')
const verifyHashedData = require('./../../util/hashData') 
const Role = require('./../../config/role')
const jwt= require('jsonwebtoken')

const createVoter = async ({username,firstName,lastName,email,phone},organization_id)=>{
    try{
    const RandomPassword = `${Math.floor(100000000 +Math.random()*900000000)}`
    //!Checking if voter aleardy Exist   
        //!Voter doesn't exist so we can save him as a new voter
        //?Password hashing
        const hashedPassword = await hashData(RandomPassword)
        const newVoter= new Voter({
                username : username,
                firstName: firstName,
                lastName : lastName,
                email : email,
                phone : phone,
                password:hashedPassword,
                verified:false,
                role:Role.Voter,
                organization_id:organization_id
               
        })
        const token = jwt.sign({ voter_id: newVoter._id ,email,role: newVoter.role }, process.env.TOKEN_SECRET,{expiresIn: "1y",})
        newVoter.token = token
        const createdVoter = await newVoter.save()
        return createdVoter
    }
    catch(error){
        throw error
    }
}
const authenticateVoter = async ({email,password})=>{
    try{
        //!check if the user exist so we can login 
        const fetchedVoter= await Voter.find({email})
            //user exist so we can log in 
            //check if user is verified?
            if(fetchedVoter.length){
                //?Comparing the hashed password to the input password
                const hashedPassword=fetchedVoter[0].password
                const passwordMatch =await verifyHashedData(password,hashedPassword)
                if(passwordMatch === hashedPassword){
                    //password match
                    const token = jwt.sign({ voter_id: fetchedVoter._id ,email,role: fetchedVoter.role }, process.env.TOKEN_SECRET,{expiresIn: "1y",})
                    fetchedVoter.token = token
                    return fetchedVoter
                }else{
                    return (passwordMatch === hashedPassword)
                }
                
            }
    }catch(error){
        throw error
    }
}

module.exports = {createVoter,authenticateVoter}