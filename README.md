# BACK-END for tracking-location

# I.Install Library
```
yarn init
yarn add bcrypt express jsonwebtoken 
mongodb mongoose ngrok nodemon
```
# II.Project structures
```
    src
  |__ middlewares
  | |__ auth.js
  | |__ task.js
  | |__ ... (one reducer per file)
  | |__ index.js (root reducer) -> Use combineReducers here ^^
  |
  |__ models
  | |__ auth.js
  | |__ task.js
  | |__ ...
  |
  |__ routes
  | 
  |__ index.js (setup Store Provider) -> Wrap components here 
```

# III.Database Setup
  ## Make sure you installed MongoDB
  - MACOS
    ```
    https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
    ```
  - Windows
    ```
    https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
    ```
  ## Make sure you create -dbpatch for MongoDB
  ## Make sure MongoDB is running

# IV.Let's Go
  ## Getting Started
  ###  1. Create endpoint (index.js)
  - To create a database in MongoDB, start by using mongoose.connect() , then specify a connection URL with the correct ip address and the name of the database you want to create.MongoDB will create the database if it does not exist, and make a connection to it.
  
    ```c
    const mongoose = require('mongoose');
    const express = require('express');
    const bodyParser = require('body-parser');

    const connectionString = 'mongodb://localhost/trackingDatabase'
    const configOption = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }

    mongoose.connect(connectionString, configOption);

    mongoose.connection.on('error', (err) => {
      console.log(err);
    })

    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected successfully')
    })

    const app = express();
    app.use(bodyParser.json());


    app.listen(3000, () => {
      console.log('Server is running on port 3000')
    })
    ```

### 2. Create our model 
  - The first we import 2 libraries : mongoose and bcrypt
  - Create UserSchema for Validation
    ```c
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
    ```

