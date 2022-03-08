const express= require('express')
const router = express.Router()
const {voteRoomRegisterValidation} = require('../../util/voteRoomValidation')
const {createVoteRoom} = require('./controller')
const verifyToken= require('./../../util/verifyToken')
const authorizeOrg= require('./../../util/authorizeRole')

router.post('/createvoteroom',async(req,res)=>{
    try{
     
        let {mainQuestion,organizationName,description,voters,startDate,endDate,ballotType,options} = req.body
        //Validate the Data with JOI
        const {error} = voteRoomRegisterValidation(req.body)
        if(error){
        res.status(400).send({message:error['details'][0]['message']})
        }
        else{
            const createdVoteRoom = await createVoteRoom({mainQuestion,organizationName,description,voters,startDate,endDate,ballotType,options})
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


module.exports = router