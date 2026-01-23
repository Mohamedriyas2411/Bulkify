import React, {useState, useEffect} from 'react';
import BuyerNavbar from '../components/BuyerNavbar';
import './Cart.css'; // We will create this

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [activeTab, setActiveTab] = useState('cart'); 
    const [loading, setLoading] = useState(true); 

    const fetchCart = async () => {
        const token = localStorage.getItem('buyerToken');
        try {
            const res = await fetch('http://localhost:5000/api/cart', {
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();
            setCartItems(data);
            setLoading(false);
    }catch (err) {
        console.error("Error fetching cart", err);
        setLoading(false);
    }
  };

    useEffect(() => {
        fetchCart();
    }, []);
    // Navigate to product details page
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

return (
    <div className='cart-container'>
        <BuyerNavbar/>
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
                    
                    {/* "No items added: 2" as per image text */}
                    <p className="cart-qty">No items added: {item.quantity}</p>
                    
                    <button 
                      className="btn-remove"
                      onClick={() => handleRemove(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Wishlist Placeholder */}
        {activeTab === 'wishlist' && (
          <div className="wishlist-placeholder">
            <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>Wishlist is empty</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;