import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts } from '../store/slices/postSlice';
import PostCard from '../components/PostCard';
import { FaSpinner } from 'react-icons/fa';

const Home = () => {
  const { posts, loading, error, total, currentPage, totalPages } = useSelector(state => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Latest Blog Posts</h1>
      
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No posts available yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
          
          {total > 0 && (
            <div className="flex justify-center items-center space-x-4">
              <span className="text-gray-600">
                Page {currentPage} of {totalPages} ({total} total posts)
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;