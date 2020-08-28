const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const SECRET_KEY = 'YOUR_SECRET_KEY';
const JWT_OPTIONS = {
  expiresIn:'7d'
}

const authenticationMiddleware =  (request,response,next) => {
  const {authorization} = request.headers;
  if(!authorization){
    return response.status(401).send({error:'You must have token'});
  }

  const token = authorization.replace('Bearer ','');
  
  jwt.verify(token,SECRET_KEY,JWT_OPTIONS,async (err,payload) => {
    if(err){
      return response.status(401).send({err:'You must have token'});
    }
    const {userID} = payload;
    const user  = await User.findById({_id:userID});
    request.user = user;
    next();
  })
}

module.exports = authenticationMiddleware;
