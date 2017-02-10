import mongoose from 'mongoose'
import { MONGODB_CONNECTION_TEST } from '../app/config'

// Use ES6 Promise
mongoose.Promise = global.Promise;

before((done) => {
  mongoose.connect(`mongodb://${MONGODB_CONNECTION_TEST}`);
  mongoose.connection
    .once('open', () => done())
    .on('error', err => {
      console.warn('Warning', err);
    });
});

beforeEach((done) => {
  const { users, projects } = mongoose.connection.collections;
  users.drop(() => {
    projects.drop(() => {
      // Ready to run the next test
      done();
    });
  });
})
