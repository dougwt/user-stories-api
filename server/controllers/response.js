module.exports = {

  // All went well, and (usually) some data was returned.
  success(data) {
    return {
      status: 'success',
      data: data
    }
  },

  // There was a problem with the data submitted, or some pre-condition
  // of the API call wasn't satisfied
  fail() {
    return {
      status: 'fail',
      data: data
    }
  },

  // An error occurred in processing the request, i.e. an exception was thrown
  error(message) {
    return {
      status: 'error',
      message: message
    }
  }
};
