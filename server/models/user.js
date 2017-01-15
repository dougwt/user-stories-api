import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Define our model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true, required: true },
  password: String,
  name: String,
  creation_date: { type: Date, default: Date.now }
});

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
