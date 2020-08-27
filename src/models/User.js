const mongoose = require('mongoose');
const brcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email:{
    type:String,
    unique:true,
    required:true
  },
  password:{
    type:String,
    required:true
  }
})

// Hooks 
/* 1.We get context of this Model (use declare function not use arrow function)
 * 2.Validation if user isModified (existing -> resolve done() )
 * 3.Else we call bcrypt function genSalt (valueSalt)
 * 4.Then we call hash function (hash password with salt value above)
 * 5.Finally we set user password to hash value
 *  */ 
UserSchema.pre('save',function(done){
  const user = this;
  if(!user.isModified('password')) 
    return done();
  brcrypt.genSalt(100,(err,salt) => {
    if(err) 
      return next(err);
    brcrypt.hash(user.password,salt,(err,hash) => {
      if(err)
        return next(err);
      user.password = hash;
      next();
    });
  });
});

//Compare
/**
 * 1.Add new property for UserSchema call it comparePassword
 * 2.Return new Promise with compare method of bcrypt
 * 3.Compare parameter password with hash value in out database
 */

UserSchema.methods.comparePassword = function comparePassword(comparePassword){
  const user = this;
  return new Promise((resolve,reject) => {
    brcrypt.compare(comparePassword,user.password,(err,isMatchPassword) => {
      if(err)
        return reject(err)
      if(!isMatchPassword)
        return reject(false);
      resolve(true)
    })
  })
}

mongoose.model('User',UserSchema);