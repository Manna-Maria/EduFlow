const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const path = require("path");
const fs = require("fs");

ffmpeg.setFfmpegPath(ffmpegPath);

const splitVideo = (inputPath) => {
  return new Promise((resolve, reject) => {
    const outputDir = path.join(__dirname, "../uploads/chunks");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPattern = path.join(outputDir, "chunk-%03d.mp4");

    ffmpeg(inputPath)
      .outputOptions([
        "-c copy",
        "-map 0",
        "-segment_time 120", // 2 minutes
        "-f segment"
      ])
      .output(outputPattern)
      .on("end", () => {
        const files = fs.readdirSync(outputDir).map(file =>
          path.join(outputDir, file)
        );
        resolve(files);
      })
      .on("error", reject)
      .run();
  });
};

module.exports = splitVideo;