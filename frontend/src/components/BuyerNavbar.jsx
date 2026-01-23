import React from "react";
import { Link, useNavigate} from "react-router-dom";
import {ShoppingCart} from 'lucide-react';
import '../pages/Home.css';
import { Menu, X } from 'lucide-react';
import { useState } from "react";


const BuyerNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("buyerToken");
        navigate("/login/buyer");
    };
    const [isMobile, setIsMobile] = useState(false);
    
    return (
        
        <nav className="navbar seller-navbar-container">
            <div className="logo-container">
                <div className="logo-icon">
                    <ShoppingCart size={20}/>
                </div>
                <span>BULKIFY</span>
            </div>
            <div className="seller-welcome">
                Welcome buyer!
            </div>

            <button className="mobile-menu-icon" onClick={() => setIsMobile(!isMobile)}>
                            {isMobile ? <X size={30} /> : <Menu size={30} />}
            </button>

            

            <ul 
                className={isMobile ? "nav-links-mobile" : "nav-links seller-nav-links"}
                onClick={() => setIsMobile(false)} // Close menu when a link is clicked
            >
                <li><Link to="/dashboard/buyer">HOME</Link></li>
                <li><Link to="/cart">CART</Link></li>
                <li><Link to="/group">GROUP</Link></li>
                <li><Link to="/community">COMMUNITY</Link></li>
                <li><Link to="/profile">PROFILE</Link></li>
                <li>
                    <Link to="/login/buyer"> LOG OUT</Link>
               
                </li>
            </ul>
            </nav>
);
   };

export default BuyerNavbar;