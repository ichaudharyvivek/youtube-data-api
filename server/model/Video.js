const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
  videoId: {
    type: String,
    index: true,
    required: true,
    unique: true,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  publishedAt: {
    type: String,
  },
  URL: {
    type: String,
  },
  thumbnails: {
    type: Object,
  },
  viewCount: {
    type: String,
  },
  likeCount: {
    type: String,
  },
  dislikeCount: {
    type: String,
    default: '0',
  },
  channelId: {
    type: String,
  },
  channelTitle: {
    type: String,
  },
  channelDescription: {
    type: String,
  },
  channelThumbnail: {
    type: Object,
  },
  channelSubscribers: {
    type: String,
  },
});

module.exports = mongoose.model('Video', videoSchema);
