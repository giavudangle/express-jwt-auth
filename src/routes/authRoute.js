const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const User = mongoose.model('User');

const SECRET_KEY = 'YOUR_SECRET_KEY';
const JWT_OPTIONS = {
  expiresIn:'7d'
}
router.post('/register',async (request,response) => {
  const {email,password} = request.body;
  try{
    const user = new User({email:email,password:password});
    await user.save()
    const token = jwt.sign({userID:user._id},SECRET_KEY,JWT_OPTIONS)
    response.send({token})
  }
  catch(err){
    return response.status(422).send(err.message)
  } 
})

router.post('/login',async (request,response) => {
  const {email,password} = request.body;
  if(!email || !password){
    return response.status(422).send({error:'Youst must provide email and password'})
  }
  const user = await User.findOne({email});
  if(!user){
    return response.status(404).send({error:'Invalid email or password'})
  }
  try {
    await user.comparePassword(password);
    const token = jwt.sign({userID:user._id},SECRET_KEY,JWT_OPTIONS)
    response.send({token})
  }
  catch(err){
    return response.status(422).send({err:'Invalid password or email'})
  }
})

module.exports = router;