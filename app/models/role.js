import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: {
    type: String,
    required: true
  }
},
{
  timestamps: { createdAt: '_createdAt', updatedAt: '_updatedAt' }
});

module.exports = roleSchema;
