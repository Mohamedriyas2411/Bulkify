import React from 'react';  
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './BuyerLogin.css';
import '../pages/Home.css'; // Reusing global styles for layout/watermark
import HeroImg from '../assets/hero-illustration.png'; 
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const BuyerLogin = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState(""); 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {

      const response = await fetch('http://localhost:5000/api/buyers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.msg || "Login failed");

        return;
      }
      // 4. Success: Save Token & Redirect
      localStorage.setItem('buyerToken', data.token);
      alert("Login Successful!");
      navigate('/buyer/dashboard'); // Redirect to buyer dashboard
    }
    catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
      console.log("Error:", error);
    }
  };


  return (
    <div className="main-container">
      <Navbar />
      
      <section className="hero-section">
        {/* Reusing Watermark */}
        <div className="watermark-text">
          <span>B</span>
          <span>U</span>
          <span>L</span>
          <span>K</span>
          <span>I</span>
          <span>F</span>
          <span>Y</span>
        </div>

        <div className="hero-content">
          {/* Left Side: Image */}
          <div className="hero-image-container">
            <img src={HeroImg} alt="Community Bulk Buying" className="hero-img" />
          </div>

          {/* Right Side: Sign In Form */}
          <div className="login-form-container">
            <h2 className="login-heading">Sign in</h2>
            
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Name</label>
                <input type="text" placeholder="" name='name' onChange={handleChange}/>
              </div>

              <div className="input-group">
                <label>Email</label>
                <input type="email" placeholder="" name='email' onChange={handleChange} />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input type="password" placeholder="" name='password' onChange={handleChange} />
              </div>

              <button type="submit" className="signin-button">
                Sign in
              </button>

              <p className="register-link">
                Not Registered? <Link to="/register">Register</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BuyerLogin;