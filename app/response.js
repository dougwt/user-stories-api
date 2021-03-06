module.exports = {

  // All went well, and (usually) some data was returned.
  success(data) {
    return {
      status: 'success',
      data
    }
  },

  // There was a problem with the data submitted, or some pre-condition
  // of the API call wasn't satisfied
  fail(data) {
    return {
      status: 'fail',
      data
    }
  },

  // An error occurred in processing the request, i.e. an exception was thrown
  error(message) {
    return {
      status: 'error',
      message
    }
  },

  // The user has been successfully authenticated and will be returned a token
  authenticated(token) {
    return {
      status: 'success',
      token
    }
  }
};
