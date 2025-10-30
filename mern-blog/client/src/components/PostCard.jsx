import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaCalendar, FaComment, FaHeart } from 'react-icons/fa';

const PostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {post.image && post.image.url && (
        <img 
          src={post.image.url} 
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">
          <Link to={`/post/${post._id}`} className="text-blue-600 hover:text-blue-800">
            {post.title}
          </Link>
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.content.substring(0, 150)}...
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <FaUser className="mr-1" />
            <span>{post.author?.name || 'Anonymous'}</span>
          </div>
          <div className="flex items-center">
            <FaCalendar className="mr-1" />
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center mt-4 space-x-4">
          <div className="flex items-center text-gray-500">
            <FaComment className="mr-1" />
            <span>{post.comments?.length || 0}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <FaHeart className="mr-1" />
            <span>{post.likes?.length || 0}</span>
          </div>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
            {post.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;