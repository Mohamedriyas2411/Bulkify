import React, { useState, useEffect } from "react";  
import Navbar from "../components/Navbar";
import "../pages/BuyerLogin.css";
import "../pages/Home.css"; // Reusing global styles for layout/watermark
import HeroImg from "../assets/hero-illustration.png";
import { useNavigate } from "react-router-dom";


const SellerRegister =() =>{
    const navigate = useNavigate();
    const[formData, setFormData] = useState({
        shopName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [location,setLocation] = useState({
        latitude: '',
        longitude: ''
    });

    const[error, setError] = useState('');

    // Request geolocation only in response to a user gesture (button click)
    const requestLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude.toString(),
                    longitude: position.coords.longitude.toString(),
                });
                setError('');
                alert('Location captured successfully!');
            },
            (err) => {
                console.error('Location access denied or error:', err);
                setError('Unable to retrieve location. Please allow location access.');
            }
        );
    };

    const handleChange =(e) =>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () =>{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(formData.email)){
            return "Invalid email format.";
        }

        const phoneRegex = /^\d{10}$/;
        if(!phoneRegex.test(formData.phone)){
            return "Invalid phone number format.";
        }

        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        if(!passwordRegex.test(formData.password)){
            return "Password must be 6-16 characters long and include at least one number and one special character.";
        }

        if(formData.password !== formData.confirmPassword){
            return "Passwords do not match.";
        }
        if(!location.latitude || !location.longitude){
            return "Location access is required.";
        }
        return null;
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const validationError = validateForm();
        if(validationError){
            setError(validationError);
            return;
        }
        try{
            const payload ={
                shopName: formData.shopName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                location: {
                    latitude: location.latitude,
                    longitude: location.longitude
                }
            };

            const response = await fetch("http://localhost:5000/api/sellers/register",{
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if(!response.ok){
                setError(data.errors?data.errors[0].msg:data.msg);
                return;
            }

            localStorage.setItem("sellerToken", data.token);
            alert("Registration successful!");
            navigate("/dashboard/seller");
        } catch (error) {
            console.error("Error during registration:", error);
            setError("An error occurred during registration.");
        }
    };

    return(
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
                  <div className="login-form-container">
                    <h2 className="login-heading">Sign up</h2>
                    {error && <p style={{color: 'red', fontSize: '0.9rem', marginBottom: '10px'}}>{error}</p>}
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Shop name</label>
                            <input
                                type="text"
                                name="shopName"
                                value={formData.shopName}
                                onChange={handleChange}
                                placeholder=""
                                autoComplete="organization"
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
                                autoComplete="email"
                            />
                        </div>
                        <div className="input-group">
                            <label>Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder=""
                                autoComplete="tel"
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
                                autoComplete="new-password"
                            />
                        </div>
                        <div className="input-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder=""
                                autoComplete="new-password"
                            />
                        </div>
                        
                        <button type="button" className="signin-button" onClick={requestLocation}>
                        Get current location
                        </button>
                            
                      
                            <button type="submit" className="signin-button">
                                Sign up
                            </button>
                            <p className="register-link">
                                Already Registered? <a href="/login/seller">Sign in</a>
                            </p>
                        </form>
                      </div>
                
                  </div>
                  
        </section>
        </div>
        
    );
};

export default SellerRegister;