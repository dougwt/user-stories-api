import app from './app'
import { API_PORT } from './app/config'

app.listen(API_PORT, () => {
  console.log(`API server listening on: ${API_PORT}`);
});
