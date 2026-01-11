import React from "react";
import Navbar from '../src/components/Navbar';
import './Home.css';

import HeroImg from '../assets/hero-illustration.png';

const Home = () => {
    return(
        <div className="main-container">
            <Navbar />
            <section className="hero-section">
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
                    <div className="hero-image-container">
                        <img src={HeroImg} alt="Community Bulk Buying" className="hero-img"/>
                    </div>

                    <div className="hero-text">
                        <h1 className="headline">
                            Community based<br />
                            <strong>Bulk Buying Platform</strong>
                        </h1>

                        <p className="description">
                            Bulkify is a community-based bulk buying platform that helps
              users save money by purchasing products together. By joining
              nearby groups, buyers get better prices, sellers receive bulk
              orders, and deliveries are optimized through a shared drop-off
              point.
                        </p>

                        <button className="cta-button">
                            JOIN NOW
                        </button>
                    </div>
                </div>
            </section>
        </div>
        
    );
};

export default Home;