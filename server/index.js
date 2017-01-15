import { app } from './app'

// Server setup
export const port = process.env.API_PORT || 8080;

app.listen(port, () => {
  console.log(`API server listening on: ${port}`);
});
