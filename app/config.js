// Node Environment (prod, dev, test, etc.)
// Used to determine which environment the app is currently running in.
export const NODE_ENV = process.env.NODE_ENV || 'dev'

// MongoDB Connection String URI (excluding the 'mongodb://' prefix)
// Reference: https://docs.mongodb.com/manual/reference/connection-string/
export const MONGODB_CONNECTION = process.env.MONGODB_CONNECTION || 'localhost/user_stories';
export const MONGODB_CONNECTION_TEST = process.env.MONGODB_CONNECTION_TEST || 'localhost/user_stories_test';
