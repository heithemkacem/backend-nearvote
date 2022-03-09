const Voter = require('./model')
const hashData = require('./../../util/hashData')
const verifyHashedData = require('./../../util/hashData') 
const Role = require('./../../config/role')

const createVoter = async ({username,firstName,lastName,email,phone},organization_id)=>{
    try{
    const RandomPassword = `${Math.floor(100000000 +Math.random()*900000000)}`
    username = username.trim()
    firstName = firstName.trim()
    lastName = lastName.trim()
    email = email.trim()
    phone = phone.trim()
    //!Checking if voter aleardy Exist   
    const existingVoter = await Voter.find({email})
    if(existingVoter.length){
        //todo A voter aleady exist
        throw Error("A voter aleardy exists with the same email ")
    }else{
        //!Voter doesn't exist so we can save him as a new voter
        //?Password hashing
        const hashedPassword = await hashData(RandomPassword)
        const newVoter= new Voter({
                username,
                firstName,
                lastName,
                email,
                phone,
                password:hashedPassword,
                verified:false,
                role:Role.Voter,
                organization_id:organization_id
               
        })
        const createdVoter = await newVoter.save()
        return createdVoter
    }
    }catch(error){
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
                    console.log(passwordMatch)
                    return fetchedVoter
                }else{
                    console.log(passwordMatch)
                    console.log(hashedPassword)
                    throw Error("Incorrect credentials match") 
                }
            }
    }catch(error){
        throw error
    }
}

module.exports = {createVoter,authenticateVoter}