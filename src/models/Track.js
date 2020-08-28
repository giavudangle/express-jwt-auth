const mongoose = require('mongoose');

// Point Schema save our coordinate
const PointSchema = new mongoose.Schema({
  timstamp:Number,
  coors:{
    latitude:Number,
    longitude:Number,
    altitude:Number,
    accuracy:Number,
    heading:Number,
    speed:Number
  }
});

// Track Schema store our User with their locations
const TrackSchema = new mongoose.Schema({
  _userID:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  trackName:{
    type:String,
    default:''
  },
  locations:[PointSchema]
})

mongoose.model('Track',TrackSchema);