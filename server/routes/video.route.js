const express = require('express');
const router = express.Router();

// Route Functions
const {
  videosList,
  videoDetails,
  videosListUpdate,
  purge,
} = require('../controllers/video.controller');

router.get('/', videosList);
router.get('/:videoId', videoDetails);
router.post('/videosListUpdate', videosListUpdate);
router.delete('/', purge);

module.exports = router;
