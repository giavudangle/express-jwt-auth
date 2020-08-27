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