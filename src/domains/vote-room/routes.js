const express= require('express')
const router = express.Router()
const {voteRoomRegisterValidation} = require('../../util/voteRoomValidation')
const {createVoteRoom} = require('./controller')
const {sendVoterVerificationEmail} = require('./../voter_email_verification/controller')
const verifyToken= require('./../../util/verifyToken')
const authorizeOrg= require('./../../util/authorizeRole')
const VoteRoom = require('./model')
const Voter = require ('./../voter/model')


router.post('/createvoteroom',verifyToken,async(req,res)=>{
    try{
        let {organization_id} = req.user
        let {roomName,roomDescription,voters} = req.body
        //Validate the Data with JOI
        const {error} = voteRoomRegisterValidation(req.body)
        if(error){
        res.status(400).send({message:error['details'][0]['message']})
        }
        else{
            const createdVoteRoom = await createVoteRoom({roomName,roomDescription,voters},organization_id)
            res.json({
                status:'Success',
                message:'Vote Room added',
                data:createdVoteRoom,
            })
        }
    }catch(error){
        throw error
    }
})


router.get('/voteroomslist',(req,res)=>{
    VoteRoom.find((err,data)=>{
        if(err){
           console.log(err)
        }else{
            if(data.length){
               res.json({
                   data: data,
               })
            }else{
               res.json({
                   data: "no data",
               })
            }
        }
})
})
router.get('/voteroomslist/:voterId',(req,res)=>{
    const {voterId} = req.params
    Voter.findById({_id:voterId},(err,data)=>{
        if(err){
            console.log(err)
        }else{
        if(data){
        let array = []
        VoteRoom.find((err,data)=>{
            if(err){
            console.log(err)
            }else{
                if(data.length){
                    data.map((voteroom)=>{
                        voteroom.voters.map((voter)=>{
                            if(voter === voterId){
                                array.push(voteroom)
                            }
                        })
                    })
                res.json({
                    data: array
                })
                
                }
                else{
                res.json({
                    data: "no data",
                })
                }
            }
    })
    }else{
            console.log("that voter id doeasnt exisit")
    }
}})})
router.post('/sendvotersemail',async(req,res)=>{
    let{id} = req.body
    VoteRoom.findOne({id},(err,data)=>{
            if(err){
                console.log(err)
            }else{
                data.voters.map(voter=>(
                    sendVoterVerificationEmail(voter)
                ))
            }
    })
    res.json({
        status: "Pending",
        message: "Emails has been sent to the voters"
    })
})

router.put('/update-vote-room/:voteroomid',async(req,res)=>{
    try{
    const {voteroomid} = req.params
    const values = req.body

    const existingVoteRoom = await VoteRoom.findById(voteroomid)
    if(existingVoteRoom){
        await VoteRoom.updateOne({_id:voteroomid},values)
        res.json({
            status:"Success",
            message :"Vote Room has been updated",
            data2 : existingVoteRoom
        })  
    }else{
        res.json({
            status:"Failed",
            message :"Vote Room Doesnt Exist"
        })
    }
    }catch(err) {
        throw (err)

    }
   
})
module.exports = router