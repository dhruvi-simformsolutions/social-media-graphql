const jwt = require('jsonwebtoken');
const {AuthenticationError} = require('apollo-server')
module.exports =(context) =>{
    // context = {...heaeder}
    console.log("contextcontext",context?.req?.headers?.authorization)
    const authHeader = context?.req?.headers?.authorization;
    if(authHeader){
        const token = authHeader.split("Bearer ")[1];
        if(token){
            try{
                const user = jwt.verify(token,process.env.JWT_SECRET)
                return user;
            } catch(err){
                throw new AuthenticationError('Invalid/Expire Token') 
            }
        } else{
            throw new Error('Authentication token must be \'Bearer[token]')
        }
    } else{
        throw new Error('Authorization header must be provided')
    }
}