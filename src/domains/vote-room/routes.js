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
        res.send({status:"Failed",message:error['details'][0]['message']})
        }
        else{
            const createdVoteRoom = await createVoteRoom({roomName,roomDescription,voters},organization_id)
            res.json({
                status:'Success',
                message:'VoteRoom added',
                data:createdVoteRoom,
            })
        }
    }catch(error){
        res.json({
            status:'Failed',
            message:error.message
        })  
    }
})
router.get('/voterooms/:voterId',(req,res)=>{
    const {voterId} = req.params
    Voter.findById({_id:voterId},(error,data)=>{
        if(error){
            console.log(error)
        }else{
        if(data){
        VoteRoom.find((error,data)=>{
            if(error){
            console.log(error)
            }else{
                if(data.length){
                res.json({
                    data: data
                })}else{
                res.json({
                    data: "no data",
                })
                }
            }
        })
        }else{
            res.json({
                status:'Failed',
                message:"That voter id doeasnt exisit"
            })  
        }
}})})

router.get('/voteroomslist',verifyToken,(req,res)=>{
    let {organization_id} = req.user
    VoteRoom.find(({organization_id:organization_id}),(error,data)=>{
        if(error){
            console.log(error)
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
    Voter.findById({_id:voterId},(error,data)=>{
        if(error){
            console.log(error)
        }else{
        if(data){
        let array = []
        VoteRoom.find((error,roomdata)=>{
            if(error){
            console.log(error)
            }else{
                if(roomdata.length){
                    roomdata.map((voteroom)=>{
                        voteroom.voters.map((voter)=>{
                            if(voter === data.email){
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
        res.json({
            status:'Failed',
            message:"That voter id doeasnt exisit"
        })  
    }
}})})
router.post('/sendvotersemail',async(req,res)=>{
    let{id} = req.body
    VoteRoom.findOne({id},(error,data)=>{
            if(error){
                console.log(error)
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
            message :"VoteRoom has been updated",
            data2 : existingVoteRoom
        })  
    }else{
        res.json({
            status:"Failed",
            message :"VoteRoom doesnt exist"
        })
    }
    }catch(error) {
        res.json({
            status:'Failed',
            message:error.message
        }) 

    }
   
})
module.exports = router