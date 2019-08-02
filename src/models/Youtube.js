const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const YoutubeSchema = new Schema({
  videoName: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = Youtube = mongoose.model("youtube", YoutubeSchema);
