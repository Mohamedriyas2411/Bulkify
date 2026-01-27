import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route }  from 'react-router-dom';
import Home from './pages/Home';
import JoinSelection from './pages/JoinSelection';
import BuyerLogin from './pages/BuyerLogin';
import BuyerRegister from './pages/BuyerRegister';
import SellerLogin from './pages/SellerLogin';
import SellerRegister from './pages/SellerRegister';
import DeliveryLogin from './pages/DeliveryLogin';
import DeliveryRegister from './pages/DeliveryRegister';
import About from './pages/About'; // Import the component
import Contact from './pages/Contact';
import SellerDashboard from './pages/SellerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Community from './pages/Community';
import Group from './pages/Group'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<JoinSelection />} />
        <Route path="/login/buyer" element={<BuyerLogin />} />
        <Route path="/register" element={<BuyerRegister />} />
        <Route path="/login/seller" element={<SellerLogin />} />
        <Route path="/register/seller" element={<SellerRegister />} />
        <Route path="/login/delivery" element={<DeliveryLogin />} />
        <Route path="/register/delivery" element={<DeliveryRegister />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/community" element={<Community />} />
        <Route path="/group" element={<Group />} />

      </Routes>
    </Router>
  );
}

export default App;
