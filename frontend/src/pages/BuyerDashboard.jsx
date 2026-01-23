import React, { useState, useEffect } from 'react';
import BuyerNavbar from '../components/BuyerNavbar';
import { Search, ShoppingBag } from 'lucide-react';
import './BuyerDashboard.css'; // We will create this
import bannerBg from '../assets/banner-bg.png';

const BuyerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('fresh'); // Default active category

  // 1. Fetch Nearby Products on Load
  useEffect(() => {
    const fetchNearbyProducts = async () => {
      const token = localStorage.getItem('buyerToken');
      try {
        // Fetch from the new endpoint we created
        const res = await fetch('http://localhost:5000/api/products/nearby', {
          headers: { 'x-auth-token': token } // Ensure your middleware expects this header name
        });
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };
    fetchNearbyProducts();
  }, []);

  // 2. Handle Filtering (Search + Category)
  useEffect(() => {
    let result = products;

    // Filter by Category
    if (selectedCategory) {
      // Mapping button names to your DB values
      // Buttons: 'fresh', 'packaged', 'dry'
      // DB values: 'fresh', 'packaged', 'clothing' (for dry as per your select options)
      
      let dbCategory = selectedCategory;
      if (selectedCategory === 'dry') dbCategory = 'clothing'; 
      
      result = result.filter(p => p.category === dbCategory);
    }

    // Filter by Search Term
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  return (
    <div className="dashboard-container">
      <BuyerNavbar />
      
      <div className="dashboard-content">
        {/* Banner Section */}
        <div className="dashboard-banner" style={{ backgroundImage: `url(${bannerBg})` }}>
          <div className="banner-overlay">
            <h1>Add products to join communities</h1>
            
            {/* Search Bar */}
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search products" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="search-icon" size={20} />
            </div>

            {/* Category Filter Buttons */}
            <div className="category-buttons">
              <button 
                className={`cat-btn ${selectedCategory === 'fresh' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('fresh')}
              >
                Fresh Products
              </button>
              <button 
                className={`cat-btn ${selectedCategory === 'packaged' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('packaged')}
              >
                Packaged products
              </button>
              <button 
                className={`cat-btn ${selectedCategory === 'dry' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('dry')}
              >
                Dry products
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="product-section">
          <div className="product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product._id} className="product-card">
                  <img 
                    src={product.image || "https://via.placeholder.com/150"} 
                    alt={product.name} 
                    className="product-img" 
                  />
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-price">Rs. {product.price}</p>
                  
                  <div className="card-actions-buyer">
                    <button className="btn-add-cart">
                      <ShoppingBag size={16} /> add
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{textAlign: 'center', gridColumn: '1/-1', color: '#666'}}>
                No products found in your area for this category.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;