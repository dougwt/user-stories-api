const mongoose = require('mongoose');

before(done => {
  mongoose.connect('mongodb://localhost/user_stories_test');
  mongoose.connection
    .once('open', () => done())
    .on('error', err => {
      console.warn('Warning', err);
    });
});

beforeEach(done => {
  const { user } = mongoose.connection.collections;
  user.drop()
    .then(() => done())
    .catch(() => done());
})
