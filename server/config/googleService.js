const { google } = require('googleapis');

const service = google.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY,
});

module.exports = service;
