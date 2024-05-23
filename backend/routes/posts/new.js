const express = require("express");
const Post = require("../../Models/post");
const verifyToken = require("../../middleware/verifyToken");
const router = express.Router();
router.post("/", verifyToken, async (req, res) => {
  if (req.userRole !== "admin") {
    return res
      .status(400)
      .json({ message: "Samo administratori smiju objavljivati." });
  }
  const username = req.user.username;
  const userId = req.userId;
  const { title, description } = req.body;

  try {
    const newPost = await Post.create({
      title: title,
      description: description,
      author: {
        id: userId,
        username: username,
      },
    });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: "Neuspješno objavljivanje posta." });
  }
});
module.exports = router;
