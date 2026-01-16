import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "../pages/BuyerLogin.css";
import "../pages/Home.css"; 
import HeroImg from "../assets/hero-illustration.png";

const SellerLogin = () => {
  const navigate = useNavigate();

  // 1. State for form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    shopName: "" // Optional for UI, but usually not needed for backend login
  });

  const [error, setError] = useState("");

  // 2. Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch('http://localhost:5000/api/sellers/login', {
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
      localStorage.setItem('token', data.token);
      alert("Login Successful!");
      navigate('/seller/dashboard'); // Redirect to seller dashboard

    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="main-container">
      <Navbar />
      <section className="hero-section">
        {/* Reusing Watermark */}
        <div className="watermark-text">
          <span>B</span><span>U</span><span>L</span><span>K</span><span>I</span><span>F</span><span>Y</span>
        </div>

        <div className="hero-content">
          {/* Left Side: Image */}
          <div className="hero-image-container">
            <img src={HeroImg} alt="Community Bulk Buying" className="hero-img" />
          </div>

          {/* Right Side: Sign In Form */}
          <div className="login-form-container">
            <h2 className="login-heading">Sign in</h2>
            
            {/* Error Message Display */}
            {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

            <form className="login-form" onSubmit={handleSubmit}>
              
              {/* Note: Shop Name is visually here, but typically ignored for Login logic */}
              <div className="input-group">
                <label>Shop name</label>
                <input 
                  type="text" 
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  placeholder="" 
                />
              </div>

              <div className="input-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="" 
                  required
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="" 
                  required
                />
              </div>

              <button type="submit" className="signin-button">
                Sign in
              </button>

              <p className="register-link">
                Not Registered? <Link to="/register/seller">Register</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SellerLogin;