import React from 'react';
import Navbar from '../components/Navbar';
import './Home.css';
import { useNavigate } from 'react-router-dom';
// Import your image here. 
// If you don't have the exact separated image, use the one you uploaded or a placeholder.
import HeroImg from '../assets/hero-illustration.png'; 

const Home = () => {
    const navigate = useNavigate();

  return (
    <div className="main-container">
      <Navbar />
      
      <section className="hero-section">
        {/* The large background watermark "BULKIFY" */}
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
             {/* Replace src with your actual image variable */}
            <img src={HeroImg} alt="Community Bulk Buying" className="hero-img" />
          </div>

          {/* Right Side: Text */}
          <div className="hero-text">
            <h1 className="headline">
              Community based <br />
              <strong>Bulk buying Platform</strong>
            </h1>
            
            <p className="description">
              Bulkify is a community-based bulk buying platform that helps
              users save money by purchasing products together. By joining
              nearby groups, buyers get better prices, sellers receive bulk
              orders, and deliveries are optimized through a shared drop-off
              point.
            </p>

            <button className="cta-button" onClick={() => navigate("/join")}>
              JOIN NOW
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;