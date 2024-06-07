const express = require("express");
const Post = require("../../Models/post");
const verifyToken = require("../../middleware/verifyToken");
const isAdmin = require("../../utils/helpers/isAdmin");
const router = express.Router();
router.delete("/delete", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Nije naveden ID objave." });
    }
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).json({ message: "Objava ne postoji." });
    }
    return res.status(200).json({ message: "Objava izbrisana." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Neuspjelo izbrisanje objave." });
  }
});
module.exports = router;
