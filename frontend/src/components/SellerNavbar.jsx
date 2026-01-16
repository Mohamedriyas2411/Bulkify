import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X,Menu, ShoppingCart } from 'lucide-react';
import '../pages/Home.css'; 
import { useState   } from 'react';// Reusing basic navbar structure styles

const SellerNavbar = () => {
  const[isMobile, setIsMobile] =useState(false);
  
  const navigate = useNavigate();
  // In a real app, you'd get this name from your global state or context

  const handleLogout = () => {
    // Clear token and redirect to home
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar seller-navbar-container">
      <div className="logo-container">
        <div className="logo-icon">
          <ShoppingCart size={20} />
        </div>
        <span>BULKIFY</span>
      </div>
      {/* Welcome Message */}
      <div className="seller-welcome">
        Welcome back!
      </div>

      <button className="mobile-menu-icon" onClick={() => setIsMobile(!isMobile)}>
                      {isMobile ? <X size={30} /> : <Menu size={30} />}
      </button>

      
      
      {/* Seller Navigation Links */}
      <ul className={isMobile ? "nav-links-mobile": "nav-links"} onClick={() => setIsMobile(false)}>
        <li><Link to="/" onClick={handleLogout}>HOME</Link></li>
        <li><Link to="/seller/orders">ORDERS</Link></li>
        <li><Link to="/seller/profile">PROFILE</Link></li>
        <li>
          <Link to="/" onClick={handleLogout}>LOGOUT</Link>
        </li>
      </ul>
    </nav>
  );
};

export default SellerNavbar;