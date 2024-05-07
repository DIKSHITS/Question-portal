import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './SigninForm.css';

const SigninForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/signin`, formData);
      if (response.data.message === "Sign-in successful") {
        Cookies.set("user", response.data.user.email, { path: "/", secure: true, sameSite: 'strict' });
        sessionStorage.setItem("email", response.data.user.email);
        setFormData({
          email: '',
          password: ''
        });
        navigate('/admin/dashboard');
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      setError("Error signing in. Please try again later.");
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="signin-form-container">
      <h2>Signin Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="submit-btn">Sign In</button>
        {error && <div className="error-message">{error}</div>}
        <br />
        <p>Don't have an account? <Link to="/SignupForm" className="signin-link">Sign Up</Link></p>
      </form>
    </div>
  );
};

export default SigninForm;
