import React from 'react';
import Navbar from '../components/Navbar';
import { Mail, Phone, MapPin, Clock, HelpCircle } from 'lucide-react'; // Importing icons
import './Contact.css';
import '../pages/Home.css'; // Reusing global layout styles
import HeroImg from '../assets/hero-illustration.png'; 

const Contact = () => {
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

          {/* Right Side: Contact Details */}
          <div className="contact-content">
            <h2 className="contact-heading">Contact</h2>
            
            <p className="intro-text">
              We’d love to hear from you!<br />
              Whether you have a question, feedback, or need support, the 
              Bulkify team is here to help.
            </p>

            <div className="info-section">
              <h3 className="sub-heading">Get in Touch</h3>
              <div className="contact-item">
                <Mail className="icon" size={18} />
                <span>Email: support@bulkify.com</span>
              </div>
              <div className="contact-item">
                <Phone className="icon" size={18} />
                <span>Phone: +91 7339281872</span>
              </div>
              <div className="contact-item">
                <MapPin className="icon" size={18} />
                <span>Location: India</span>
              </div>
            </div>

            <div className="info-section">
              <h3 className="sub-heading">Support Hours</h3>
              <div className="contact-item">
                <Clock className="icon" size={18} />
                <span>Monday – Saturday</span>
              </div>
              <div className="contact-item pl-icon"> 
                {/* pl-icon adds padding to align with text above since no icon here */}
                <span>9:00 AM – 6:00 PM</span>
              </div>
            </div>

            <div className="info-section">
              <h3 className="sub-heading">How Can We Help?</h3>
              <ul className="help-list">
                <li>Questions about communities or bulk purchases</li>
                <li>Payment, wallet, or refund support</li>
                <li>Seller or delivery partner inquiries</li>
                <li>Feedback and suggestions</li>
              </ul>
            </div>

            <p className="footer-note">
              You can also reach out to us directly through the in-app support 
              for faster assistance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 