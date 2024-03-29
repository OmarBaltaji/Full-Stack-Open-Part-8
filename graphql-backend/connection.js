require('dotenv').config();

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const MONGODB_URI = process.env.MONGODB_URI;
console.log('connecting to', MONGODB_URI)
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log('error connection to MongoDB ' + error.message))
