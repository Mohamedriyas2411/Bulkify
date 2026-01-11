import React, { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import '../pages/Home.css';
import {Link, useNavigate} from 'react-router-dom';
const Navbar = () => {
    const[isMobile, setIsMobile] =useState(false);
    

    return (
        <nav className='navbar'>
            <div className="logo-container">
                <div className="logo-icon">
                    <ShoppingCart size={20} />
                </div>
                <span>BULKIFY</span>
            </div>
            
            <button className="mobile-menu-icon" onClick={() => setIsMobile(!isMobile)}>
                {isMobile ? <X size={30} /> : <Menu size={30} />}
            </button>
            
            <ul className={isMobile ? "nav-links-mobile": "nav-links"} onClick={() => setIsMobile(false)}>
                <li><a href="#home" >HOME</a></li>
                <li><a href="#about" >ABOUT</a></li>
                <li><a href="#shop" >SHOP</a></li>
                <li><a href="#contact" >CONTACT</a></li>
                <li className='login-btn-container'>
                    <Link to="/join" className='login-link'>LOGIN</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;