const ErrorResponse = require('../middleware/errorResponse');
const asyncHandler = require('../middleware/async');
const service = require('../config/googleService');
const { formatVideo, formatChannel } = require('../middleware/formatData');
const Video = require('../model/Video');

// @desc    Get all trending videos
// @route   GET /api/v1/videos
// @access  Public
exports.videosList = asyncHandler(async (req, res, next) => {
  const videos = await Video.find().lean();

  if (!videos) {
    return next(new ErrorResponse('Videos not found', 404));
  }

  res.status(200).json({ success: true, count: videos.length, data: videos });
});

// @desc    Get detail of single video
// @route   GET /api/v1/videos/:videoId
// @access  Public
exports.videoDetails = asyncHandler(async (req, res, next) => {
  const video = await Video.findOne({ videoId: req.params.videoId }).lean();

  if (!video) {
    return next(new ErrorResponse('Video not found', 404));
  }
  res.status(200).json({ success: true, data: video });
});

// @desc    Fetch trending videos from youtube
// @route   POST /api/v1/videos/videosListUpdate
// @access  Public
exports.videosListUpdate = asyncHandler(async (req, res, next) => {
  const nextPage = req.body.nextPage || '';

  const videoResponse = await service.videos
    .list({
      part: ['snippet', 'statistics'],
      chart: 'mostPopular',
      regionCode: process.env.YOUTUBE_REGION,
      pageToken: nextPage,
      maxResults: 12,
    })
    .then((rep) => rep.data);

  console.log(videoResponse);

  /*
     Since we are passing a async function inside a map function 
     we are resolving the pending promises by Promises.all
  */
  const videosList = await Promise.all(
    videoResponse.items.map(formatVideo).map(formatChannel)
  );

  const result = await Video.insertMany(videosList);
  if (!result) return next(new ErrorResponse('Internal Server Error', 500));

  // Send Json Response
  res.status(200).json({
    success: true,
    count: result.length,
    nextPageToken: videoResponse.nextPageToken,
    data: result,
  });
});

// @desc    Empty Database
// @route   DELETE /api/v1/videos
// @access  Public
exports.purge = asyncHandler(async (req, res, next) => {
  await Video.deleteMany();
  res.status(200).json({ success: true, msg: 'Database Cleared' });
});
