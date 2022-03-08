const Org = require('./model')
const hashData = require('./../../util/hashData')
const verifyHashedData = require('./../../util/hashData')
const Role = require('./../../config/role')
const jwt= require('jsonwebtoken')

const createOrganization = async (data)=>{
    try{
        const {orgName,orgDescription,email,password} = data
        const existingOrganization = await Org.find({email}) 
        if(existingOrganization.length){
            //A user aleady exist
            throw Error("organization aleardy exist")
        }else{
        //User doesn't exist so we can save him as a new user
        //Hashing Password 
        const hashedPassword = await hashData(password)
        
        const newOrganization= new Org({
            orgName,
            orgDescription,
            email,
            password:hashedPassword,
            verified:false,
            role:Role.Organization

        })  
        const token = jwt.sign({ organization_id: newOrganization._id ,email,role: newOrganization.role }, process.env.TOKEN_SECRET,{expiresIn: "2h",}); 
        newOrganization.token = token
        //Save the organization
        const createdOrganization = await newOrganization.save()
        return createdOrganization
        } 
    }
    catch(error) {
        throw error
    }        
        
}

const authenticateOrg = async (email,password)=>{
    try{
        const fetchedOrgs = await Org.find({email})
        if(!fetchedOrgs.length){
            throw Error("Invalid Credentials")
        }else{
            if(!fetchedOrgs[0].verified){
                throw Error("Email Hasent Been Verified, Check Your Inbox")
            }
            else{
                const hashedPassword = fetchedOrgs[0].password
                const passwordMatch = await verifyHashedData(password,hashedPassword)
                if(passwordMatch === hashedPassword ){
                    //password match
                    console.log(passwordMatch)
                    const token = jwt.sign({ organization_id: fetchedOrgs._id ,email,role: fetchedOrgs.role }, process.env.TOKEN_SECRET,{expiresIn: "2h",}); 
                    fetchedOrgs.token =token
                    return fetchedOrgs
                    
         
                }else{
                    throw Error("Incorrect credentials match") 
                }
            }
        }
    }
    catch(error) {
        throw error
    }
}
module.exports = {createOrganization,authenticateOrg}
