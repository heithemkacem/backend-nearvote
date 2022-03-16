const VotePoll = require('./model')
const createVotePoll = async ({voter_id,room_id,party_id})=>{
    try{
                const newVotePoll= new VotePoll({
                    voter_id:voter_id,
                    room_id:room_id,
                    party_id:party_id,
                })
                const createdVoteParty = await newVotePoll.save()
                return createdVoteParty
    }catch(error){
        throw error
    }
}
module.exports = {createVotePoll}