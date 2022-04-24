const service = require('../config/googleService');
const asyncHandler = require('./async');

exports.formatVideo = (video) => {
  return {
    videoId: video.id,
    title: video.snippet.title,
    description: video.snippet.description,
    publishedAt: video.snippet.publishedAt,
    URL: `https://youtube.com/watch?v=${video.id}`,
    thumbnails: video.snippet.thumbnails,
    viewCount: video.statistics.viewCount,
    likeCount: video.statistics.likeCount,
    channelId: video.snippet.channelId,
    channelTitle: video.snippet.channelTitle,
    channelDescription: '',
    channelThumbnail: '',
    channelSubscribers: '',
  };
};

exports.formatChannel = asyncHandler(async (video) => {
  const resp = await service.channels
    .list({
      part: ['id', 'snippet', 'statistics'],
      id: video.channelId,
    })
    .then((r) => r.data);

  channelData = resp.items[0];

  video.channelDescription = channelData.snippet.description;
  video.channelThumbnail = channelData.snippet.thumbnails;
  video.channelSubscribers = channelData.statistics.subscriberCount;

  return video;
});
