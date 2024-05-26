const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const seeddata = require('./seed')

const app = express();
app.use(bodyParser.json());




const startServer = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected successfully');

    // Seed the data
    await seeddata();

    // Use Routes
    app.use('/',require('./routes/route'))

    // Start the Server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start the server:', err);
    process.exit(1); // Exit process with failure
  }
};
startServer()