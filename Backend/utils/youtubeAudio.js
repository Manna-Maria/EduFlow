const ytdlp = require("yt-dlp-exec");
const path = require("path");
const fs = require("fs");

const downloadAudioFromYouTube = async (youtubeUrl) => {
  try {
    const audioDir = path.join(__dirname, "../uploads/audio");

    // Create folder if not exists
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    const fileName = `${Date.now()}.mp3`;
    const outputPath = path.join(audioDir, fileName);

    await ytdlp(youtubeUrl, {
      extractAudio: true,
      audioFormat: "mp3",
      output: outputPath
    });

    return outputPath;

  } catch (error) {
    console.error("YouTube Audio Download Error:", error);
    throw new Error("Failed to download audio");
  }
};

module.exports = downloadAudioFromYouTube;