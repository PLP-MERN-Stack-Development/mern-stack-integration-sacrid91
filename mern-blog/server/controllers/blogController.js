const BlogPost = require('../models/BlogPost');
const User = require('../models/User');

// @desc    Get all blog posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await BlogPost.find()
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await BlogPost.countDocuments();

    res.json({
      success: true,
      count: posts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: posts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single blog post
// @route   GET /api/posts/:id
// @access  Public
const getPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create blog post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    const post = await BlogPost.create({
      title,
      content,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      author: req.user.id,
      image: req.body.image || {}
    });

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update blog post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
  try {
    let post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete blog post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await post.remove();

    res.json({
      success: true,
      message: 'Post removed'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      user: req.user.id,
      content: req.body.content
    };

    post.comments.unshift(comment);
    await post.save();

    const populatedPost = await BlogPost.findById(req.params.id)
      .populate('comments.user', 'name avatar');

    res.json({
      success: true,
      data: populatedPost
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user already liked
    if (post.likes.some(like => like.toString() === req.user.id)) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    post.likes.unshift(req.user.id);
    await post.save();

    res.json({
      success: true,
      likes: post.likes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unlike post
// @route   PUT /api/posts/:id/unlike
// @access  Private
const unlikePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user has not liked
    if (!post.likes.some(like => like.toString() === req.user.id)) {
      return res.status(400).json({ message: 'Post has not been liked' });
    }

    post.likes = post.likes.filter(like => like.toString() !== req.user.id);
    await post.save();

    res.json({
      success: true,
      likes: post.likes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
  likePost,
  unlikePost
};