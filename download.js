const Vimeo = require("@vimeo/vimeo").Vimeo;
const request = require("request");
const fs = require("fs");
const readline = require("readline");

// Replace with your Vimeo credentials
const clientId = "";
const clientSecret = "";
const accessToken = "";

const vimeoClient = new Vimeo(clientId, clientSecret, accessToken);

// Function to extract video ID from URL
function extractVideoId(url) {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

// Function to download video
function downloadVideo(videoId) {
  console.log(`Fetching video ${videoId}...`);

  vimeoClient.request(
    {
      method: "GET",
      path: `/videos/${videoId}`,
    },
    (error, body, statusCode, headers) => {
      if (error) {
        console.log(`Error fetching video ${videoId}:`, error);
        return;
      }

      // console.log(`Fetched video ${videoId}`, body);

      const videoName = videoId; //body.name;
      const videoUrl = body.download[0].link;

      request(videoUrl)
        .pipe(fs.createWriteStream(`${videoName}.mp4`))
        .on("close", () => {
          console.log(`Downloaded ${videoName}.mp4`);
        });
    }
  );
}

// Read URLs from input file
const rl = readline.createInterface({
  input: fs.createReadStream("videoUrls.txt"),
  output: process.stdout,
  terminal: false,
});

rl.on("line", (line) => {
  const videoId = extractVideoId(line.trim());
  if (videoId) {
    downloadVideo(videoId);
  } else {
    console.log(`Invalid URL: ${line}`);
  }
});

rl.on("close", () => {
  console.log("All URLs processed.");
});
