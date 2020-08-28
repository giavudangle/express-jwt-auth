const express =require('express');
const mongoose = require('mongoose');
const authenticationMiddleware = require('../middlewares/authMiddleware');

const Track = mongoose.model('Track');
const router = express.Router();
router.use(authenticationMiddleware);


router.get('/tracks',async (request,response) => {
  try {
    const track = await Track.find({_userID:request.user._id});
    response.send({track})
  }
  catch(err){
    response.status(404).send({error:'Dont find track'})
  }
})


router.post('/tracks',async (request,response) => {
  const {trackName,locations} = request.body;
  console.log(request.body)
  if(!trackName || !locations) 
    response.status(422)
    .send({error:'You must have track name and locations'})
  try {
    const newTrack = new Track({
      _userID:request.user._id,
      trackName,
      locations
    })
    await newTrack.save();
    response.send(newTrack)
  }
  catch(err) {
    response.status(422).send({error:err.message})
  }
})

module.exports = router;