const joi = require ('joi')

const voteRoomRegisterValidation= (data)=>{
    const schemaValidation = joi.object({
        mainQuestion:joi.string().required().min(4).max(1024),
        organizationName:joi.string().required().min(4).max(26),
        startDate:joi.date().required(),
        endDate:joi.date().required(),
        ballotType:joi.string().required(),
        voters:joi.array().required(),
        options:joi.string().required(),
        description:joi.string().required(),
    })
    return schemaValidation.validate(data)
}

module.exports.voteRoomRegisterValidation = voteRoomRegisterValidation  
