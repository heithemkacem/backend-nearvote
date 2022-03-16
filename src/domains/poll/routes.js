const express= require('express')
const router = express.Router()
const {createVotePoll} = require('./controller')
const VotePoll = require('./model')
router.post('/createpoll',async(req,res)=>{
    try{
        let {voter_id,room_id,party_id} = req.body
            const existingVotePoll =await VotePoll.find({voter_id:voter_id},{room_id:room_id},{party_id:party_id})
            if(existingVotePoll.length){
                console.log(existingVotePoll)
                res.json({
                    status : "Failed",
                    message : "Vote poll aleardy exist"
                })
            }else{
                await createVotePoll({voter_id,room_id,party_id})
                res.json({
                    status:'Success',
                    message:'Vote has been submited',
                })
            }
            
    }catch(error){
        throw error
    }
})

module.exports = router