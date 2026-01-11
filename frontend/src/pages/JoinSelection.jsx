import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './JoinSelection.css';
import '../pages/Home.css'; // Importing Home.css to reuse the watermark/layout styles
import HeroImg from '../assets/hero-illustration.png'; // Ensure this path is correct

const JoinSelection = () => {
  const navigate = useNavigate();

  // Function to handle where each button goes
  const handleSelection = (role) => {
    console.log(`Selected role: ${role}`);
    if(role==='BUYER'){
        navigate('/login/buyer');
    } else if(role==='SELLER'){
        navigate('/login/seller');
    } else if(role==='DELIVERY'){
        navigate('/login/delivery');
    }
  };

  return (
    <div className="main-container">
      <Navbar />
      
      <section className="hero-section">
        {/* Reusing the Watermark from Home.css */}
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
          {/* Left Side: Image (Same as Home) */}
          <div className="hero-image-container">
            <img src={HeroImg} alt="Community Bulk Buying" className="hero-img" />
          </div>

          {/* Right Side: Join Selection Buttons */}
          <div className="join-content">
            <h2 className="join-heading">JOIN AS</h2>
            
            <div className="button-group">
              <button 
                className="role-button" 
                onClick={() => handleSelection('BUYER')}
              >
                BUYER
              </button>
              
              <button 
                className="role-button" 
                onClick={() => handleSelection('SELLER')}
              >
                SELLER
              </button>
              
              <button 
                className="role-button" 
                onClick={() => handleSelection('DELIVERY')}
              >
                DELIVERY MAN
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JoinSelection;