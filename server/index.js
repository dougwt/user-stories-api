const app = require('./app');

// Server setup
export const port = process.env.API_PORT || 3090

app.listen(port, () => {
  console.log('API server listening on port 3050');
});
