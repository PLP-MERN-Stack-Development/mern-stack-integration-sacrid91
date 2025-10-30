import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postAPI } from '../../services/api';

export const getPosts = createAsyncThunk(
  'post/getPosts',
  async (params = {}) => {
    const response = await postAPI.getPosts(params);
    return response.data;
  }
);

export const getPost = createAsyncThunk(
  'post/getPost',
  async (id) => {
    const response = await postAPI.getPost(id);
    return response.data;
  }
);

export const createPost = createAsyncThunk(
  'post/createPost',
  async (postData) => {
    const response = await postAPI.createPost(postData);
    return response.data;
  }
);

export const updatePost = createAsyncThunk(
  'post/updatePost',
  async ({ id, postData }) => {
    const response = await postAPI.updatePost(id, postData);
    return response.data;
  }
);

export const deletePost = createAsyncThunk(
  'post/deletePost',
  async (id) => {
    await postAPI.deletePost(id);
    return id;
  }
);

export const addComment = createAsyncThunk(
  'post/addComment',
  async ({ postId, commentData }) => {
    const response = await postAPI.addComment(postId, commentData);
    return response.data;
  }
);

export const likePost = createAsyncThunk(
  'post/likePost',
  async (postId) => {
    const response = await postAPI.likePost(postId);
    return response.data;
  }
);

export const unlikePost = createAsyncThunk(
  'post/unlikePost',
  async (postId) => {
    const response = await postAPI.unlikePost(postId);
    return response.data;
  }
);

const postSlice = createSlice({
  name: 'post',
  initialState: {
    posts: [],
    post: null,
    loading: false,
    error: null,
    total: 0,
    currentPage: 1,
    totalPages: 1,
  },
  reducers: {
    clearPost: (state) => {
      state.post = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.data;
        state.total = action.payload.total;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.pages;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPost.fulfilled, (state, action) => {
        state.loading = false;
        state.post = action.payload.data;
      })
      .addCase(getPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload.data);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post._id === action.payload.data._id);
        if (index !== -1) {
          state.posts[index] = action.payload.data;
        }
        if (state.post && state.post._id === action.payload.data._id) {
          state.post = action.payload.data;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post._id !== action.payload);
        if (state.post && state.post._id === action.payload) {
          state.post = null;
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        if (state.post) {
          state.post = action.payload.data;
        }
      })
      .addCase(likePost.fulfilled, (state, action) => {
        if (state.post) {
          state.post.likes = action.payload.likes;
        }
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        if (state.post) {
          state.post.likes = action.payload.likes;
        }
      });
  },
});

export const { clearPost } = postSlice.actions;
export default postSlice.reducer;