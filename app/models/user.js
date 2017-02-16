import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt-nodejs'

mongoose.Promise = global.Promise;

// Define our model
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    validate: function(email) {
      return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
    }
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
},
{
  timestamps: { createdAt: '_createdAt', updatedAt: '_updatedAt' }
});
userSchema.plugin(uniqueValidator);

// Encrypt password before saving records
userSchema.pre('save', function(next) {
  // Get access to the User model
  const user = this;

  // Generate a salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }

    // Hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }

      // Overwrite plain text password with encrypted password
      user.password = hash;
      next()
    })
  })
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return callback(err); }

    callback(null, isMatch);
  })
}

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
