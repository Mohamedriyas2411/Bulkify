import React from "react";  
import Navbar from "../components/Navbar";
import "../pages/BuyerLogin.css";
import "../pages/Home.css"; // Reusing global styles for layout/watermark
import HeroImg from "../assets/hero-illustration.png";
import { useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";
import { useState } from "react";


const BuyerRegister =() =>{
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [location, setLocation]  = useState({
        longitude: '',
        latitude: ''
    });

    const [error, setError] = useState('');

    const requestLocation = () => {
        if (!navigator.geolocation){
            setError('Geolocation is not supported by your browser.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) =>{
                setLocation({
                    latitude: position.coords.latitude.toString(),
                    longitude:position.coords.longitude.toString()
                });
                setError('');
                alert('Location captured successfully!');
            },
            (err) =>{
                console.error('Location access denied or error:', err);
                setError('Unable to retrieve location. Please allow location access.');
            }
        );
    };

    const handleChange = (e) =>{
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
            return "Phone number must be 10 digits.";
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
            const payload={
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                location: {
                    latitude: location.latitude,
                    longitude: location.longitude
                }
            };
            const res = await fetch('http://localhost:5000/api/buyers/register',{
                method: 'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if(!res.ok){
                setError(data.errors?data.errors[0].msg:data.msg);
                return;
            }

            localStorage.setItem("buyerToken", data.token);
            alert("Registration successful!");
            navigate("/buyer/dashboard");


        }catch(err){
                console.error('Registration error:', err);
                setError('Registration failed. Please try again later.');
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
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Name</label>
                            <input type="text"name="name" onChange={handleChange} value={formData.name} autoComplete="name" placeholder="" />
                        </div>
                        <div className="input-group">
                            <label>Email</label>
                            <input type="email" name="email" onChange={handleChange} value={formData.email} autoComplete="email" placeholder="" />
                        </div>
                        <div className="input-group">
                            <label>Phone</label>
                            <input type="text" name="phone" onChange={handleChange} value={formData.phone} placeholder="" />
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <input type="password" name="password" onChange={handleChange} value={formData.password} autoComplete="new-password" placeholder="" />
                        </div>
                        <div className="input-group">
                            <label>Confirm Password</label>
                            <input type="password" name="confirmPassword" onChange={handleChange} value={formData.confirmPassword} placeholder="" />
                        </div>
                        <button type="button" className="signin-button" onClick={requestLocation}>
                            Get current location
                        </button>
                            <button type="submit" className="signin-button">
                                Sign up
                            </button>
                            <p className="register-link">
                                Already Registered? <a href="/login/buyer">Sign in</a>
                            </p>
                        </form>
                      </div>
                
                  </div>
                  
        </section>
        </div>
        
    );
};

export default BuyerRegister;