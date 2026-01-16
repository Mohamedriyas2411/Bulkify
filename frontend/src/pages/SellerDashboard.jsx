import React, { useState, useEffect } from 'react';
import SellerNavbar from '../components/SellerNavbar';
import ProductModal from '../components/ProductModal'; // Import Modal
import { Search, Edit, Trash2 } from 'lucide-react';
import './SellerDashboard.css';

// Import local image fallback if backend image fails
import bannerBg from '../assets/banner-bg.png';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // 1. Fetch Products from Backend on Load
  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Debug log
    
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }
    
    try {
      const res = await fetch('http://localhost:5000/api/products/myproducts', {
        headers: { 'x-auth-token': token }
      });
      
      console.log('Response status:', res.status); // Debug log
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error('API Error:', errorData);
        return;
      }
      
      const data = await res.json();
      console.log('Products fetched:', data); // Debug log
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Handle Add/Edit Logic
  const handleSaveProduct = async (productData) => {
    const token = localStorage.getItem('token');
    const url = editingProduct 
      ? `http://localhost:5000/api/products/update/${editingProduct._id}`
      : 'http://localhost:5000/api/products/add';
    
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(productData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts(); // Refresh list
        alert(editingProduct ? "Product Updated!" : "Product Added!");
      } else {
        alert("Failed to save product");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Handle Delete
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this product?")) return;
    
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:5000/api/products/delete/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      fetchProducts(); // Refresh list
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    console.log("Searching for:", value);

    
  }
  // Open Modal for Editing
  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Open Modal for Adding
  const openAddModal = () => {
    setEditingProduct(null); // Clear editing state
    setIsModalOpen(true);
  };

  return (
    <div className="dashboard-container">
      <SellerNavbar />
      
      {/* Pop-up Modal */}
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveProduct}
        productToEdit={editingProduct}
      />

      <div className="dashboard-content">
        {/* Banner */}
        <div className="dashboard-banner" style={{ backgroundImage: `url(${bannerBg})` }}>
          <div className="banner-overlay">
            <h1>List products & start selling</h1>
            
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search products" 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="search-icon" onClick={handleSearch} size={20} />
            </div>

            <div className="banner-actions">
              <button className="btn-orange" onClick={openAddModal}>List products</button>
              <button className="btn-white" onClick={openAddModal}>Add products</button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="product-section">
          <div className="product-grid">
            {products
              .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.price.toString().includes(searchTerm) ||
                  p.quantity.toString().includes(searchTerm))
              .map((product) => (
              <div key={product._id} className="product-card">
                {/* Use uploaded image or placeholder */}
                <img src={product.image || "https://via.placeholder.com/150"} alt={product.name} className="product-img" />
                
                <h3 className="product-title">{product.name}</h3>
                <p className="product-price">Rs. {product.price}</p>
                <p className="product-qty" style={{fontSize: '0.8rem', color: '#666'}}>Qty: {product.quantity}</p>
                
                <div className="card-actions">
                  <button className="btn-edit" onClick={() => openEditModal(product)}>
                    <Edit size={14} /> edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(product._id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;