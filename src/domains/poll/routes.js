const express= require('express')
const router = express.Router()
const {createVotePoll} = require('./controller')
const VotePoll = require('./model')
const Voter = require('./../voter/model')
const VoteRoom = require('./../vote-room/model')
const VoteParty = require('./../vote_party/model')
router.post('/createpoll',async(req,res)=>{
    try{
            let {voter_id,room_id,party_id,voter_option} = req.body
            const existingVoter = await Voter.findById({_id:voter_id})
            const existingVoteRoom = await VoteRoom.findById({_id:room_id})
            const existingVoteParty = await VoteParty.findById({_id:party_id})
            const existingPoll =await VotePoll.findOne({voter_id : voter_id} && {room_id : room_id} && {party_id : party_id})
           
                if(existingVoter){
                    //? check if the voter exist
                    if(existingVoteRoom){
                        //? check if the room exist
                        existingVoteRoom.voters.map((voter)=>{
                            //! mapping the room voters to validate only the choosen voters
                            if(voter === voter_id){
                                //! voter is verified to vote in the room
                                if(existingVoteParty){
                                    //?check if the party exist
                                    if(existingPoll){
                                        //a request aleardy exist
                                            res.json({
                                                        status:'Failed',
                                                        message:'You have aleardy voted',
                                            }) 
                                    }else{
                                    //! create the poll and update the party data
                                        createVotePoll({voter_id,room_id,party_id})
                                        existingVoteParty.voted_voters = [...existingVoteParty.voted_voters ,voter ]
                                        existingVoteParty.option_count = [...existingVoteParty.option_count ,voter_option ]
                                        VoteParty.findByIdAndUpdate({_id : party_id},{voted_voters : existingVoteParty.voted_voters,option_count :existingVoteParty.option_count })
                                        res.json({                                                
                                            status:'Success',
                                            message:'Vote has been submited',
                                            data : existingVoteParty
                                        }) 
                                    }
                            }else{
                                res.json({
                                    status:"Failed",
                                    message:"Vote Party Doeasnt Exist"
                                })
                            }
                            }else{
                                res.json({
                                    status : "Failed",
                                    message : "voter is not allowed to vote in this room"
                                })
                            }
                        })
                    }else{
                        res.json({
                            status:"Failed",
                            message:"Vote Room Doeasnt Exist"
                        })
                    }
                }else{
                    res.json({
                        status:"Failed",
                        message:"Voter Doeasnt Exist",
                    })
                }
    }catch(error){
        throw error
    }
})
module.exports = router