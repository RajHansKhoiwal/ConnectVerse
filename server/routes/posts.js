import express from "express";
import { getFeedPosts, getUserPosts, likePost, updateUserPicturePath } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts); // Show every single post in the database
router.get("/:userId/posts", verifyToken, getUserPosts); // Show every post for a particular user.

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/editprofilepic/:id", verifyToken, updateUserPicturePath);

export default router;