const joi = require ('joi')
const registerValidation= (data)=>{
    const schemaValidation = joi.object({
        orgName:joi.string().required().min(4).max(26),
        orgDescription:joi.string().max(1024),
        email:joi.string().required().min(6).max(256).email(),
        phone:joi.string().required(),
        password:joi.string().required().min(6).max(24),
        confirmPassword:joi.string().required().min(6).max(24)
    })
    return schemaValidation.validate(data)
}
const loginValidation= (data)=>{
    const schemaValidation = joi.object({
        
        email:joi.string().required().min(6).max(256).email(),
        password:joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)
}

module.exports.registerValidation = registerValidation  
module.exports.loginValidation = loginValidation   