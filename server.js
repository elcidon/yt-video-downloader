const express = require("express");
const connectDB = require("./config/db");
const app = express();

connectDB();

// INIT MIDDLEWARES
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.send("VAI");
});

app.use("/api/get-video", require("./src/routes/api/youtube"));

const PORT = process.env.port || 3002;

app.listen(PORT, () => console.info(`Server Started ${PORT}`));
