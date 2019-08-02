const express = require("express");
const validUrl = require("valid-url");

const readline = require("readline");
const path = require("path");

const fs = require("fs");
const ytdl = require("ytdl-core");
const Youtube = require("../../models/Youtube");
const router = express.Router();

/**
 * @route  POST /api/get-video
 * @desc   Download youtube's videos
 * @access public
 */
router.post("/", async (req, res) => {
  // Get URL via json
  const { videoUrl } = req.body;

  // Check if is a valid URL
  if (!validUrl.isUri(videoUrl)) {
    return res.status(401).json({ errors: { msg: "Invalid URL." } });
  }

  // Check if Url already exists
  const videoExists = await Youtube.findOne({ videoUrl });
  if (videoExists) {
    return res
      .status(401)
      .json({ errors: { msg: "The video already exists." } });
  }

  try {
    // Download video and save in public folder
    const videoData = await ytdl.getInfo(videoUrl);
    const videoName = videoData.title;
    const video = await ytdl(videoUrl, { format: "mp4" });
    let starttime;

    video.pipe(fs.createWriteStream(`./public/${videoName}.mp4`));

    video.once("response", () => {
      starttime = Date.now();
    });

    video.on("progress", (chunk, downloaded, total) => {
      const percent = downloaded / total;
      const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded`);
      process.stdout.write(
        `(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(
          total /
          1024 /
          1024
        ).toFixed(2)}MB)\n`
      );
      process.stdout.write(
        `running for: ${downloadedMinutes.toFixed(2)}minutes`
      );
      process.stdout.write(
        `, estimated time left: ${(
          downloadedMinutes / percent -
          downloadedMinutes
        ).toFixed(2)}minutes `
      );
      readline.moveCursor(process.stdout, 0, -1);
    });

    video.on("end", async () => {
      process.stdout.write("\n\n");
      // Save data
      ytVideo = await new Youtube({
        videoName,
        videoUrl
      });
      ytVideo.save();

      return res.status(200).send("Success!");
    });
  } catch (error) {
    res.status(500).send("Server error!");
  }

  // Return ok only after the video been downloaded

  // Save video in database
});

module.exports = router;
