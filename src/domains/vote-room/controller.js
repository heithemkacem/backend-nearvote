const VoteRoom = require('./model')
const hashData = require('./../../util/hashData')
const verifyHashedData = require('./../../util/verifyHashedData')
const createVoteRoom = async ({mainQuestion,organizationName,description,startDate,endDate,ballotType,voters,options})=>{
    try{
        //String method that is used to remove whitespace characters from the start and end of a string
        mainQuestion = mainQuestion.trim()
        organizationName = organizationName.trim()
        description = description.trim()
        //!Saving the vote-room
        //?Password hashing
        //const hashedMainQuestion = await hashData(mainQuestion)
        //const hashedOrganizationName = await hashData(organizationName)
        //const hashedStartDate = await hashData(startDate)
        //const hashedEndDate = await hashData(endDate)
        //const hashedballotType = await hashData(ballotType)
        const newVoteRoom= new VoteRoom({
            mainQuestion,
            organizationName,
            voters,
            startDate,
            endDate,
            ballotType,
            options,
            description,
     
        })
        const createdVoteRoom = await newVoteRoom.save()
        return createdVoteRoom
    }catch(error){
        throw error
    }
}

module.exports = {createVoteRoom}