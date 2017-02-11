import mongoose, { Schema } from 'mongoose';
import roleSchema from './role';
import storySchema from './story';
import uniqueValidator from 'mongoose-unique-validator';

mongoose.Promise = global.Promise;

// Define our model
const projectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    validate: (slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  },
  roles: [roleSchema],
  stories: [storySchema],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    default: null
  }
},
{
  timestamps: { createdAt: '_createdAt', updatedAt: '_updatedAt' }
});
projectSchema.plugin(uniqueValidator);

// Create the model class
const ModelClass = mongoose.model('project', projectSchema);

// Export the model
module.exports = ModelClass;
