const VotePoll = require('./model')
const Voter = require('./../voter/model')
const VoteRoom = require('./../vote-room/model')
const VoteParty = require('./../vote_party/model')

const createVotePoll = async ({voter_id,room_id,party_id})=>{
    try{
            const existingVoter = await Voter.findById({_id:voter_id})
            const existingVoteRoom = await VoteRoom.findById({_id:room_id})
            const existingVoteParty = await VoteParty.findById({_id:party_id})
            if(existingVoter ){
                const newVotePoll= new VotePoll({
                    voter_id:voter_id,
                    room_id:room_id,
                    party_id:party_id,
                })
                const createdVoteParty = await newVotePoll.save()
                return createdVoteParty
            }else{
              return console.log("no voter exsit")  
            }
            
    }catch(error){
        throw error
    }
}
module.exports = {createVotePoll}