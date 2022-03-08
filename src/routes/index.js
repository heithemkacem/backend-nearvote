const express = require('express')
const router = express.Router()

const OrganizationRoutes = require('./../domains/org')
const VoterRoutes = require('./../domains/voter')
const EmailVerificationRoute = require('./../domains/email_verification')
const ForgotPasswordRoute = require('./../domains/forgot_password')
const VoteRoom = require('./../domains/vote-room')



router.use("/org",OrganizationRoutes)
router.use("/voter",VoterRoutes)
router.use("/voteroom",VoteRoom)
router.use("/email_verification",EmailVerificationRoute)
router.use("/forgot_passwords",ForgotPasswordRoute)

module.exports= router