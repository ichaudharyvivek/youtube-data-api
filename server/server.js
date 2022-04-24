const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const cors = require('cors');
dotenv.config({ path: './config/config.env' });

// Constants
const app = express();
const PORT = process.env.PORT || 3000;

// Routes
const videoRouter = require('./routes/video.route');

// Initialization
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Connect DB
connectDB();

// API
app.use('/api/v1/videos', videoRouter);

// Main ROUTES
app.route('/').get((req, res) => {
  res.json({ success: true, msg: 'Welcome to the app' });
});

// Listen to PORT
const server = app.listen(PORT, (req, res) => {
  console.log(
    `Server started on port ${PORT} in ${process.env.NODE_ENV} by ${process.env.AUTHOR}`
  );
});

// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);

  // Close server and exit process
  server.close(() => process.exit(1));
});
