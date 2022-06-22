const express = require('express')
const router = express.Router()

const OrganizationRoutes = require('./../domains/org')
const VoterRoutes = require('./../domains/voter')
const ForgotPasswordRoute = require('./../domains/forgot_password')
const VoterForgotPasswordRoute = require('./../domains/voter_forgot_password')
const VoteRoom = require('./../domains/vote-room')
const VoterEmailVerification = require('./../domains/voter_email_verification')
const VoteParty = require('./../domains/vote_party')
const UserOTPVerification = require('./../domains/orgotpverification')





router.use("/org",OrganizationRoutes)
router.use("/voter",VoterRoutes)
router.use("/voteroom",VoteRoom)
router.use("/forgot_passwords",ForgotPasswordRoute)
router.use("/voter_forgot_passwords",VoterForgotPasswordRoute)
router.use("/voter_email_verification",VoterEmailVerification)
router.use("/voteparty",VoteParty)
router.use("/otp-verification",UserOTPVerification)


module.exports= router