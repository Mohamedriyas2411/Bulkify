import React, { useState, useEffect } from 'react';
import BuyerNavbar from '../components/BuyerNavbar';
import { useLocation, useNavigate } from 'react-router-dom'; // Import hooks
import './Cart.css';


const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [activeTab, setActiveTab] = useState('cart'); 
    const [loading, setLoading] = useState(true); 
    const [wishlistLoading, setWishlistLoading] = useState(true);
    
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we are here to Select an item for Group creation
    const isSelectionMode = location.state && location.state.selectionMode;

    const fetchCart = async () => {
        const token = localStorage.getItem('buyerToken');
        try {
            const res = await fetch('http://localhost:5000/api/cart', {
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();
            setCartItems(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching cart", err);
            setLoading(false);
        }
    };

    const fetchWishlist = async () => {
        const token = localStorage.getItem('buyerToken');
        try {
            const res = await fetch('http://localhost:5000/api/products/wishlist', {
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();
            setWishlistItems(data);
            setWishlistLoading(false);
        } catch (err) {
            console.error("Error fetching wishlist", err);
            setWishlistLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
        fetchWishlist();
    }, []);

    const handleRemove = async(cartId) => {
        const token = localStorage.getItem('buyerToken');
        try {
            await fetch(`http://localhost:5000/api/cart/remove/${cartId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            fetchCart();
        } catch (err) {
            console.error("Error removing item from cart", err);
        }
    };

    const handleRemoveWishlist = async(productId) => {
        const token = localStorage.getItem('buyerToken');
        try {
            await fetch('http://localhost:5000/api/products/wishlist/remove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ productId })
            });
            fetchWishlist();
        } catch (err) {
            console.error("Error removing item from wishlist", err);
        }
    };

    // NEW: Handle Selecting an item to return to Group page
    const handleSelectProduct = (item) => {
        navigate('/group', { 
            state: { 
                selectedCartItemFromCart: item 
            } 
        });
    };

    return (
        <div className='cart-container'>
            <BuyerNavbar/>
            
            {/* Show a banner if in Selection Mode */}
            {isSelectionMode && (
                <div style={{backgroundColor: '#e0f2fe', padding: '10px', textAlign: 'center', color: '#0369a1', fontWeight: 'bold'}}>
                    Please select a product for your Group
                </div>
            )}

            <div className='cart-content'>
                <div className='cart-tabs'>
                    <button className={`tab-btn ${activeTab === 'cart' ? 'active-orange' : 'inactive-grey'}`} onClick={() => setActiveTab('cart')}>Cart Items</button>
                    <button className={`tab-btn ${activeTab === 'wishlist' ? 'active-orange' : 'inactive-grey'}`} onClick={() => setActiveTab('wishlist')}>Wishlist</button>
                </div>

                {activeTab === 'cart' && (
                    <div className="cart-grid">
                        {loading ? (
                            <p>Loading cart...</p>
                        ) : cartItems.length === 0 ? (
                            <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>Your cart is empty.</p>
                        ) : (
                            cartItems.map((item) => (
                                <div key={item._id} className="cart-card">
                                    <img 
                                        src={item.product?.image || "https://via.placeholder.com/150"} 
                                        alt={item.product?.name} 
                                        className="cart-img" 
                                    />
                                    
                                    <div className="cart-details">
                                        <h3 className="cart-title">{item.product?.name}</h3>
                                        <p className="cart-price">Rs. {item.product?.price}</p>
                                        <p className="cart-qty">Qty: {item.quantity}</p>
                                        
                                        {/* CONDITIONAL BUTTON RENDERING */}
                                        {isSelectionMode ? (
                                            <button 
                                                className="btn-select" // Style this blue/green in CSS
                                                style={{backgroundColor:'#38bdf8' , color: 'white', border: 'none', padding: '6px 20px', borderRadius: '20px', float: 'right', cursor: 'pointer'}}
                                                onClick={() => handleSelectProduct(item)}
                                            >
                                                Select This
                                            </button>
                                        ) : (
                                            <button 
                                                className="btn-remove"
                                                onClick={() => handleRemove(item._id)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                        
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'wishlist' && (
                    <div className="cart-grid">
                        {wishlistLoading ? (
                            <p>Loading wishlist...</p>
                        ) : wishlistItems.length === 0 ? (
                            <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>Wishlist is empty</p>
                        ) : (
                            wishlistItems.map((item) => (
                                <div key={item._id || item.product?._id} className="cart-card">
                                    <img 
                                        src={item.product?.image || "https://via.placeholder.com/150"} 
                                        alt={item.product?.name} 
                                        className="cart-img" 
                                    />
                                    <div className="cart-details">
                                        <h3 className="cart-title">{item.product?.name}</h3>
                                        <p className="cart-price">Rs. {item.product?.price}</p>
                                        {/* Wishlist does not have quantity */}
                                        <button 
                                            className="btn-remove"
                                            onClick={() => handleRemoveWishlist(item.product?._id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Cart;