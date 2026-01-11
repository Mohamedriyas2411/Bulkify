import React from 'react';
import Navbar from '../components/Navbar';
import './About.css';
import '../pages/Home.css'; // Reusing global styles for layout/watermark
import HeroImg from '../assets/hero-illustration.png'; 

const About = () => {
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

          {/* Right Side: About Text */}
          <div className="about-content">
            <h2 className="about-heading">
              Community based Bulk <br />
              buying Platform
            </h2>
            
            <div className="about-text-block">
              <p>
                Bulkify is a community-driven bulk buying platform designed to 
                help people save money by purchasing products together. We 
                believe that when individuals come together as a community, they 
                can unlock better prices, reduce unnecessary delivery costs, and 
                make smarter purchasing decisions.
              </p>

              <p>
                Our platform connects buyers, bulk sellers, and delivery partners 
                in a single ecosystem where group purchasing is simple, 
                transparent, and efficient. Buyers can join nearby communities, 
                participate in product-specific bulk buying groups, and enjoy 
                discounts based on collective demand. Sellers benefit from 
                guaranteed bulk orders, while delivery partners enable efficient 
                last-mile distribution by delivering orders to a central community 
                location.
              </p>

              <p>
                Bulkify is built with a focus on local collaboration, affordability, 
                and convenience. By encouraging shared purchases and optimized 
                delivery routes, we aim to reduce costs for users while promoting 
                sustainable consumption practices. Our goal is to make bulk 
                buying accessible, reliable, and rewarding for everyone involved. 
                At Bulkify, we are committed to empowering communities to buy 
                together, save more, and build stronger local connections.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;