const VoteParty = require('./model')

const createVoteParty = async ({mainQuestion,startDate,endDate,ballotType,options,VoteRoomId})=>{
    try{
        const newVoteParty= new VoteParty({
            mainQuestion,
            startDate,
            endDate,
            ballotType,
            options,
            room_id:VoteRoomId
        })
        const createdVoteParty = await newVoteParty.save()
        return createdVoteParty
    }catch(error){
        throw error
    }
}
module.exports = {createVoteParty}