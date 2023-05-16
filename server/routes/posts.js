import express from "express";
import { getFeedPosts, getUserPosts, likePosts } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* Read */
router.get("/", verifyToken, getFeedPosts); // Show every single posts in the database
router.get("/:userId/posts", verifyToken, getUserPosts);  //// Show every single posts for a particular user.

/* Update */
router.patch("/:id/like", verifyToken, likePosts);

export default router; 