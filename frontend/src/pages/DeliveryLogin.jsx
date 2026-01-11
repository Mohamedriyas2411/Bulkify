import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './BuyerLogin.css';
import '../pages/Home.css'; // Reusing global styles for layout/watermark
import HeroImg from '../assets/hero-illustration.png'; 

const DeliveryLogin = () => {
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
            
            <form className="login-form">
              <div className="input-group">
                <label>Name</label>
                <input type="text" placeholder="" />
              </div>

              <div className="input-group">
                <label>Email</label>
                <input type="email" placeholder="" />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input type="password" placeholder="" />
              </div>

              <button type="submit" className="signin-button">
                Sign in
              </button>

              <p className="register-link">
                Not Registered? <Link to="/register/delivery">Register</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeliveryLogin;