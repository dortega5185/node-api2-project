const express = require("express");

const blogpostsRouter = require("./blogposts/blogposts-router.js");

const server = express();

server.use(express.json());

const port = 5000;

server.get("/", (req, res) => {
  res.send("Hello from Express");
});

server.use("/api/posts", blogpostsRouter);

server.listen(port, () =>
  console.log("\n*** Api is running on http://localhost:5000 ***\n")
);
