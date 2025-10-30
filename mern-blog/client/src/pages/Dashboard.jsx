import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getPosts } from '../store/slices/postSlice';
import PostCard from '../components/PostCard';
import { FaSpinner, FaEdit, FaPlus } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const { posts, loading } = useSelector(state => state.post);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      dispatch(getPosts());
    }
  }, [dispatch, user]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const userPosts = posts.filter(post => post.author._id === user._id);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
        <p className="text-gray-600">Manage your blog posts</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Posts</h2>
        <button
          onClick={() => navigate('/create-post')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <FaPlus className="mr-2" /> New Post
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
        </div>
      ) : userPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">You haven't created any posts yet.</p>
          <button
            onClick={() => navigate('/create-post')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center mx-auto"
          >
            <FaPlus className="mr-2" /> Create Your First Post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPosts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;