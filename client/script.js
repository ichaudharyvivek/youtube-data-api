const videosAPi = 'http://localhost:5000/api/v1/videos';
const videosList = `${videosAPi}/`;
const videoDetails = `${videosAPi}/`;
const videosListUpdate = `${videosAPi}/videosListUpdate/`;

const options = {};
document.addEventListener('DOMContentLoaded', () => {
  const pageName = window.location.pathname.split('/').slice(-1)[0];
  if (pageName === 'index.html') {
    options.method = 'GET';
    fetchVideoList(videosList, options);
  }
  if (pageName === 'video-details.html') {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('videoId');
    fetchVideoDetails(videoDetails, videoId);
  }
});

async function fetchVideoList(apiUrl, options) {
  try {
    document.getElementById('reloadButton').disabled = true;
    document.getElementById('videoList').innerHTML = '';

    console.log(document.getElementById('videoList'));

    let response = await fetch(apiUrl, options);
    console.log(response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const videosList = await response.json();
      let videoCards = '';
      console.log(videosList);
      for (let i = 0; i < videosList.data.length; i++) {
        // prettier-ignore
        videoCards += `    
        <div class="video">                           
                <img
                    src="${videosList.data[i].thumbnails.high.url}"
                    class="thumbnail"
                    alt="thumbnail"
                    id="${videosList.data[i].videoId}"
                    onclick="openVideoDetails(event)"
                />
                <div class="content">
                    <img
                        src="${videosList.data[i].channelThumbnail.high.url}"
                        class="channel-icon"
                        alt=""                        
                    />
                    <div class="info">
                        <h6 class="title">
                            ${videosList.data[i].title}
                        </h6>
                        <p class="channel-name">${
                          videosList.data[i].channelTitle
                        }</p>
                        <p class="channel-name">${nFormatter(
                          videosList.data[i].viewCount
                        )} Views
                       </p>
                    </div>
                </div>
        </div>`;
      }

      document.getElementById('videoList').innerHTML = videoCards;
      document.getElementById('loading').style.display = 'none';
      document.getElementById('reloadButton').disabled = false;
    }
  } catch (error) {
    console.log(error);
  }
}

function reloadVideoList() {
  options.method = 'POST';
  document.getElementById('loading').style.display = 'block';
  fetchVideoList(videosListUpdate, options);
}

async function fetchVideoDetails(apiUrl, videoId) {
  try {
    let response = await fetch(`${apiUrl}${videoId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const videoDetails = await response.json();
      console.log(videoDetails);
      let videoDetailsCard = '';
      // prettier-ignore
      videoDetailsCard += `
            <div class="card mb-3" style="max-width: 80%; margin: 0 auto">
                <div class="embed-responsive embed-responsive-16by9">
                    <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/${videoDetails.data.videoId}" allowfullscreen></iframe>
                </div>
                
                <div class="card-body">
                    <h5 class="card-title">${videoDetails.data.title}</h5>
                    <h6 style="margin-top:1em;">Description</h6>
                    <p class="card-text">${videoDetails.data.description}</p>
                    <span class="text-muted">${videoDetails.data.likeCount} Likes</span>
                    <span class="text-muted">&#124;</span>
                    <span class="text-muted">${videoDetails.data.viewCount} Views</span>
                    <span class="text-muted">&#124;</span>
                    <span class="text-muted">Published At: ${(videoDetails.data.publishedAt)}</span>
                    <p class="card-text"><small class="text-muted">${videoDetails.data.channelTitle}</small></p>
                </div>            
            </div>
            
            <div class="card mb-3" style="max-width: 80%; margin: 0 auto">
                <div class="card-body">
                    <h2 class="card-title">About Channel</h2>
                    <img style="width:100%; height: 400px; object-fit:fill; margin-top:2em; margin-bottom:2em;" src="${videoDetails.data.channelThumbnail.high.url}" alt="channel thumb"></img>
                    <h5 class="card-title">${videoDetails.data.channelTitle}</h5>
                    <p style="margin-top:1em;">${videoDetails.data.channelDescription}</p>                    
                    <h5 class="card-title" style="text-align:center;" class="text-muted">${videoDetails.data.channelSubscribers} Subscribers</h5>      
                </div>
            </div>
        `;

      document.getElementById('videoDetails').innerHTML = videoDetailsCard;
      document.getElementById('loading').style.display = 'none';
    }
  } catch (error) {
    console.log(error);
  }
}

async function openVideoDetails(e) {
  const videoId = e.target.id;
  window.open(`video-details.html?videoId=${videoId}`, '_self');
}

// HELPER FUNCTIONS
function nFormatter(num) {
  num = parseInt(num);
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num;
}
