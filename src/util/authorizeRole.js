const jwt = require("jsonwebtoken");
const authorizeOrg = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"]
    if (!token) {
        return res.status(403).send("A token is required for authentication")
    }
    try {
        const decoded = jwt.verify(token,process.env.TOKEN_SECRET)
        if(!decoded.role=="Organization"){
            return res.status(401).send('Access Denied: You dont have correct privilege to perform this operation')
        }
        else{
            req.user=decoded
        } 
    }catch (error) {
        res.status(401).send('Invalid Token')
        console.log(error)
    }
    return  next()
}
module.exports = authorizeOrg
