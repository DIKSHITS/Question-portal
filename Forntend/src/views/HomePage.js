import React from 'react';
import { Link } from 'react-router-dom';
import './home.css'; // Import your CSS file

const HomePage = () => {
  return (
    <div className="home-page-container">
      <div className="home-page">
        <h1 className="heading">Welcome to Our Professional Student Question Portal</h1>
        <div className="tiles-container">
          <Link to="/SignInForm" className="tile admin-tile">
            <h2 className="tile-heading">Admin Login</h2>
            <p className="tile-description">Login as an administrator</p>
          </Link>
          <Link to="/SignInForm" className="tile student-tile">
            <h2 className="tile-heading">Student Login</h2>
            <p className="tile-description">Login as a student</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
