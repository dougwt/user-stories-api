import mongoose from 'mongoose';
import storySchema from './story';

const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  stories: [storySchema]
},
{
  timestamps: { createdAt: '_createdAt', updatedAt: '_updatedAt' }
});

module.exports = roleSchema;
