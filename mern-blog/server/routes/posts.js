const express = require('express');
const { 
  getPosts, 
  getPost, 
  createPost, 
  updatePost, 
  deletePost,
  addComment,
  likePost,
  unlikePost
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.route('/:id')
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.route('/:id/comments').post(protect, addComment);
router.route('/:id/like').put(protect, likePost);
router.route('/:id/unlike').put(protect, unlikePost);

module.exports = router;