import app from './app.js';
import connectDB from './db/index.js';

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Server failed to start due to error: ${error.message}`);
    process.exit(1);
  });
