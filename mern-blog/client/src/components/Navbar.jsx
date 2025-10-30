import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { FaUser, FaSignOutAlt, FaHome, FaEdit } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <FaEdit className="mr-2" />
          MERN Blog
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-blue-200 transition">Home</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-200 transition flex items-center">
                <FaUser className="mr-1" /> Dashboard
              </Link>
              <Link to="/create-post" className="hover:text-blue-200 transition flex items-center">
                <FaEdit className="mr-1" /> New Post
              </Link>
              <button 
                onClick={handleLogout}
                className="hover:text-blue-200 transition flex items-center"
              >
                <FaSignOutAlt className="mr-1" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200 transition">Login</Link>
              <Link to="/register" className="hover:text-blue-200 transition">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;