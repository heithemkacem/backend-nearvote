const VotePoll = require('./model')
const VoteParty = require('../../src/domains/vote_party/model')
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
const updateVoteParty = async (voters,count,party_id)=>{
    await VoteParty.updateOne({_id : party_id},{voted_voters : voters , option_count : count })
}
module.exports = {createVotePoll,updateVoteParty}