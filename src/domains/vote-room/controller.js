const VoteRoom = require('./model')
const hashData = require('./../../util/hashData')
const sendEmail = require('./../../util/sendEmail')

const createVoteRoom = async ({roomName,roomDescription,voters},organization_id)=>{
    try{
        //String method that is used to remove whitespace characters from the start and end of a string
        roomName = roomName.trim()
        roomDescription = roomDescription.trim()
        //!Saving the vote-room
        //?Password hashing
        //const hashedMainQuestion = await hashData(mainQuestion)
        //const hashedOrganizationName = await hashData(organizationName)
        //const hashedStartDate = await hashData(startDate)
        //const hashedEndDate = await hashData(endDate)
        //const hashedballotType = await hashData(ballotType)
        const newVoteRoom= new VoteRoom({
            roomDescription,
            roomName,
            voters,
            organization_id:organization_id
        })
        const createdVoteRoom = await newVoteRoom.save()
        return createdVoteRoom
    }catch(error){
        throw error
    }
}
const sendVoteEmail = async ({email,_id},id)=>{
    try{
        const existingVoteRoom = VoteRoom.findOne({id})
        if(existingVoteRoom){
            const currentUrl= "http://localhost:5000/"
            const hashedVoteroomId= await hashData(id)
            const hashedVoterId= await hashData(_id)
            const mailOptions={
                from : process.env.AUTH_EMAIL,
                to: email,
                subject:"Vote Room",
                html:`<p>Click here to go to the vote room </p><p>Press <a href=${ currentUrl +"voteroom/voter/" + hashedVoteroomId + "/" + hashedVoterId}>HERE</a>to procced</p>`
            }
            await sendEmail(mailOptions)
        }else{
            throw Error("no vote room with that id exist")
        }
    }catch(error){
        console.log(error)
    }
}
module.exports = {createVoteRoom,sendVoteEmail}