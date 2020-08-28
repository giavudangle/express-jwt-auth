require('./models/User');
require('./models/Track')
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');


const authRoute = require('./routes/authRoute');
const trackRoute = require('./routes/trackRoute');

const authenticationMiddleware = require('./middlewares/authMiddleware');

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
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})

app.get('/',authenticationMiddleware,(request,response) =>{
  const {email,password,_id} = request.user;
  response.send(`Your email is ${email}`+ '\r' +`Your password is ${password}` + `${_id}` );
})

app.use(authRoute);
app.use(trackRoute);