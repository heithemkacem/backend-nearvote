const joi = require ('joi')

const voterRegisterValidation= (data)=>{
    const schemaValidation = joi.object({
        username:joi.string().required().min(4).max(1024),
        firstName:joi.string().required().min(4).max(26),
        lastName:joi.string().required().min(4).max(26),
        email:joi.string().required().min(6).max(256).email(),
        phone:joi.string().required().min(6).max(21),
    })
    return schemaValidation.validate(data)
}
const voterLoginValidation= (data)=>{
    const schemaValidation = joi.object({
        
        email:joi.string().required().min(6).max(256).email(),
        password:joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)
}

module.exports.voterRegisterValidation = voterRegisterValidation  
module.exports.voterLoginValidation = voterLoginValidation  