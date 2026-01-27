import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BuyerNavbar from '../components/BuyerNavbar';
import { ShoppingCart, Heart, ArrowLeft, Star } from 'lucide-react';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    const token = localStorage.getItem('buyerToken');
    try {
      // We can reuse the 'nearby' endpoint or create a specific single product endpoint
      // For simplicity, assuming you implement a GET /api/products/:id endpoint
      // Or we can filter from the list if you have it in state context.
      // Ideally: backend should have: router.get('/:id', authBuyer, productController.getProductById);
      
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
         headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      setProduct(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    const token = localStorage.getItem('buyerToken');
    try {
      const res = await fetch('http://localhost:5000/api/products/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ productId: product._id })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Product added to wishlist!");
        navigate('/cart'); // Optional: redirect to cart
      } else {
        console.error('Add to wishlist error:', data);
        alert(data.message || data.error || "Failed to add to wishlist");
      }
    } catch (err) {
      console.error('Network or unexpected error:', err);
      alert("Failed to add to wishlist");
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('buyerToken');
    try {
      const res = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ productId: product._id, quantity: quantity })
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        alert("Product added to cart!");
        navigate('/cart'); // Optional: redirect to cart
      } else {
        console.error('Add to cart error:', data);
        alert(data.message || data.error || "Failed to add to cart");
      }
    } catch (err) {
      console.error('Network or unexpected error:', err);
      alert("Failed to add to cart");
    }
  };

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!product) return <div className="error-screen">Product not found</div>;

  return (
    <div className="details-container">
      <BuyerNavbar />
    

      <div className="product-details-card">
        {/* Left Side: Product Info */}
        <div className="details-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
             <ArrowLeft size={40} color="#F97316" />
          </button>
          
          <h1 className="detail-title">{product.name}</h1>
          <p className="shop-name">
            {product.seller?.shopName || "Unknown Shop"} <br />
            {/* If seller location exists, show it, else placeholder */}
            <span className="shop-location">Nearby Seller</span>
          </p>

          <div className="price-tag">
            <span className="unit">1 unit</span> {/* Or parse quantity string like "1 kg" */}
            <span className="price">Rs. {product.price}</span>
          </div>

          <p className="min-qty-text">
            Min quantity for bulk purchase: <strong>{product.minQuantity}</strong>
          </p>

          {/* Description Section */}
          <div className="description-section">
             <h3>Description</h3>
             <p>{product.description || "No description available for this product."}</p>
          </div>

          <div className="action-row">
            <div className="qty-selector">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>

            <button className="add-cart-btn-large" onClick={handleAddToCart}>
              <ShoppingCart size={20} /> ADD TO CART
            </button>

            {/* Optional Wishlist Icon */}
            <div className="wishlist-icon" onClick={handleAddToWishlist}>
               <Heart size={30} />
               <span>Add to wishlist</span>
            </div>
          </div>
          
         

        </div>

        {/* Right Side: Image with Decorative Blobs */}
        <div className="details-right">
           <div className="blob-bg">
              {/* Pink/Orange blob shape in CSS */}
           </div>
           <div className="orange-star-decoration"></div>
           
           <img 
             src={product.image || "https://via.placeholder.com/400"} 
             alt={product.name} 
             className="detail-hero-img" 
           />
           
           <div className="pagination-dots">
              <span></span><span></span><span></span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;