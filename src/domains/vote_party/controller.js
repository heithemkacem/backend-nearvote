const VoteParty = require('./model')

const createVoteParty = async ({mainQuestion,startDate,endDate,option1,option2,VoteRoomId})=>{
    try{
        const newVoteParty= new VoteParty({
            mainQuestion,
            startDate,
            endDate,
            room_id:VoteRoomId,
            option1,
            option2
        })
        const createdVoteParty = await newVoteParty.save()
        return createdVoteParty
    }catch(error){
        throw error
    }
}
module.exports = {createVoteParty}