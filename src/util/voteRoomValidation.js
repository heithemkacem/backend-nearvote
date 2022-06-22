const joi = require ('joi')

const voteRoomRegisterValidation= (data)=>{
    const schemaValidation = joi.object({
        roomName:joi.string().required().min(4).max(26),
        voters:joi.array().required(),
        roomDescription:joi.string().required(),
    })
    return schemaValidation.validate(data)
}
const votePartyRegisterValidation= (data)=>{
    const schemaValidation = joi.object({
        mainQuestion:joi.string().required().min(4).max(1024),
        startDate:joi.date().required(),
        endDate:joi.date().required(),
        option1:joi.string().required(),
        option2:joi.string().required(),
        VoteRoomId:joi.string()
    })
    return schemaValidation.validate(data)
}
module.exports = {voteRoomRegisterValidation ,votePartyRegisterValidation}
