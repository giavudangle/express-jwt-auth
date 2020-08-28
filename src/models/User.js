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
 * 6.We must define parameter done for resolve middlewares if we dont have request cant be done.
 *  */ 
UserSchema.pre('save',function(done){
  const user = this;
  if(!user.isModified('password')) 
    return done();
  brcrypt.genSalt(10,(err,salt) => {
    if(err) 
      return done(err);
    brcrypt.hash(user.password,salt,(err,hash) => {
      if(err)
        return done(err);
      user.password = hash;
      done();
    });
  });
});

//Compare
/**
 * 1.Add new property (function) for UserSchema call it comparePassword
 * 2.Return new Promise with compare method of bcrypt library
 * 3.Compare passwordNeedToCompare with password hash value in our database
 */
UserSchema.methods.comparePassword = function comparePassword(passwordNeedToCompare){
  const user = this;
  return new Promise((resolve,reject) => {
    brcrypt.compare(passwordNeedToCompare,user.password,(err,isMatchPassword) => {
      if(err)
        return reject(err)
      if(!isMatchPassword)
        return reject(false);
      resolve(true)
    })
  })
}

mongoose.model('User',UserSchema);