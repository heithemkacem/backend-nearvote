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
module.exports = {createVoteRoom}