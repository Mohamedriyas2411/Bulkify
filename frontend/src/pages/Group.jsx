import React, { useState, useEffect } from 'react';
import BuyerNavbar from '../components/BuyerNavbar';
import { Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import hooks
import './Group.css';

const Group = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To receive data from Cart

  const [activeTab, setActiveTab] = useState('recommended');
  const [recGroups, setRecGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  
  // Note: We don't strictly need to fetch cartItems here anymore since we pick them on the Cart page, 
  // but keeping it doesn't hurt.
  const [cartItems, setCartItems] = useState([]); 
  
  const [createForm, setCreateForm] = useState({
    name: '',
    productId: '',
    quantity: '',
    deadline: '',
    selectedCartItem: null
  });

  const token = localStorage.getItem('buyerToken');

  // --- 1. HANDLE RETURN FROM CART SELECTION ---
  useEffect(() => {
    // Check if we were redirected back from Cart with a selected item
    if (location.state && location.state.selectedCartItemFromCart) {
      const item = location.state.selectedCartItemFromCart;
      
      // Restore draft data from storage (so user doesn't lose Group Name/Deadline)
      const draftName = sessionStorage.getItem('groupCreateName') || '';
      const draftDeadline = sessionStorage.getItem('groupCreateDeadline') || '';

      setCreateForm({
        name: draftName,
        deadline: draftDeadline,
        selectedCartItem: item,
        productId: item.product._id,
        quantity: item.quantity
      });
      
      setActiveTab('create'); // Force switch to create tab
      
      // Clear history state to prevent loop on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // --- 2. Load Razorpay SDK ---
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // --- Fetch Data ---
  useEffect(() => {
    if (activeTab === 'recommended') fetchRecGroups();
    if (activeTab === 'joined') fetchMyGroups();
    // fetchCart is optional now if picking happens on Cart Page
  }, [activeTab]);

  const fetchRecGroups = async () => {
    try {
        const res = await fetch('http://localhost:5000/api/groups/recommended', { headers: { 'x-auth-token': token }});
        const data = await res.json();
        setRecGroups(data);
    } catch(e) { console.error(e) }
  };

  const fetchMyGroups = async () => {
    try {
        const res = await fetch('http://localhost:5000/api/groups/mygroups', { headers: { 'x-auth-token': token }});
        const data = await res.json();
        setMyGroups(data);
    } catch(e) { console.error(e) }
  };

  // --- NAVIGATION HANDLER ---
  const handleGoToCartForSelection = () => {
    // 1. Save current inputs so they aren't lost
    sessionStorage.setItem('groupCreateName', createForm.name);
    sessionStorage.setItem('groupCreateDeadline', createForm.deadline);

    // 2. Navigate to Cart with a 'mode' flag
    navigate('/cart', { state: { selectionMode: true } });
  };

  // --- RAZORPAY HANDLER ---
  const handleRazorpayPayment = async (amount, type, groupData) => {
    try {
      const orderRes = await fetch('http://localhost:5000/api/groups/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ amount: amount }) 
      });
      
      const orderData = await orderRes.json();
      if (!orderRes.ok) return alert("Failed to initiate payment");

      const options = {
        key: "rzp_test_S8ZIHelisUcj9j", // Replace with your key
        amount: orderData.amount,
        currency: "INR",
        name: "Bulkify",
        description: type === 'create' ? "Create Group Payment" : "Join Group Payment",
        order_id: orderData.id,
        handler: async function (response) {
          const verifyUrl = type === 'create' 
            ? 'http://localhost:5000/api/groups/create'
            : `http://localhost:5000/api/groups/join/${groupData.targetId}`;

          const payload = type === 'create' 
            ? {
                ...groupData.payload,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              }
            : {
                quantity: groupData.quantity,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              };

          const verifyRes = await fetch(verifyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            body: JSON.stringify(payload)
          });

          if (verifyRes.ok) {
            alert("Payment Verified & Group Action Successful!");
            // Clear draft storage on success
            sessionStorage.removeItem('groupCreateName');
            sessionStorage.removeItem('groupCreateDeadline');
            setCreateForm({ name: '', productId: '', quantity: '', deadline: '', selectedCartItem: null });
            setActiveTab('joined');
          } else {
            alert("Payment Verification Failed!");
          }
        },
        theme: { color: "#F97316" }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (err) {
      console.error(err);
      alert("Error in payment flow");
    }
  };

  const initiateJoin = (group) => {
    const qty = 1; 
    const amount = group.product.price * qty;
    handleRazorpayPayment(amount, 'join', { targetId: group._id, quantity: qty });
  };

  const initiateCreate = () => {
    if(!createForm.selectedCartItem || !createForm.name || !createForm.deadline) {
      alert("Please fill all fields");
      return;
    }
    const qty = createForm.selectedCartItem.quantity;
    const price = createForm.selectedCartItem.product.price;
    const totalAmount = price * qty;

    handleRazorpayPayment(totalAmount, 'create', {
      payload: {
        name: createForm.name,
        productId: createForm.selectedCartItem.product._id,
        quantity: qty,
        deadline: createForm.deadline
      }
    });
  };

  return (
    <div className="group-container">
      <BuyerNavbar />
      <div className="cart-header-strip">
        <div className="header-search-wrapper">
           <input type="text" placeholder="Search products" className="header-search-input" />
           <Search className="header-search-icon" size={20} />
        </div>
      </div>

      <div className="group-content">
        <div className="group-tabs">
          <button className={`group-tab-btn ${activeTab === 'recommended' ? 'orange-active' : 'grey-inactive'}`} onClick={() => setActiveTab('recommended')}>Product Groups</button>
          <button className={`group-tab-btn ${activeTab === 'joined' ? 'orange-active' : 'grey-inactive'}`} onClick={() => setActiveTab('joined')}>Joined Groups</button>
          <button className={`group-tab-btn ${activeTab === 'create' ? 'orange-active' : 'grey-inactive'}`} onClick={() => setActiveTab('create')}>Create</button>
        </div>

        {activeTab === 'recommended' && (
          <div className="group-list">
            <p className="list-heading">Product groups matching your cart or community</p>
            {recGroups.map(group => (
              <div key={group._id} className="group-card">
                 <img src={group.product.image} alt="prod" className="group-img" />
                 <div className="group-info">
                    <h4>Group: {group.name}</h4>
                    <p className="prod-name">{group.product.name}</p>
                    <p className="sub-text">Target: {group.targetQuantity}</p>
                 </div>
                 <div className="group-actions">
                    <button className="btn-join-group" onClick={() => initiateJoin(group)}>Join & Pay</button>
                 </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'joined' && (
          <div className="group-list">
             {myGroups.map(group => (
              <div key={group._id} className="group-card">
                 <img src={group.product.image} alt="prod" className="group-img" />
                 <div className="group-info">
                    <h4>Group: {group.name}</h4>
                    <p className="prod-name">{group.product.name}</p>
                    <p className="sub-text status-text">Status: {group.status}</p>
                 </div>
                 <button className="btn-join-group disabled">Joined</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="create-group-wrapper">
             <div className="form-field">
               <label>Group name</label>
               <input type="text" value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})} />
             </div>

             <div className="form-field">
               <label>Deadline Date</label>
               <input type="date" value={createForm.deadline} onChange={e => setCreateForm({...createForm, deadline: e.target.value})} />
             </div>

             <div className="form-field">
               <label>Product</label>
               <div className="cart-selection-area">
                 {createForm.selectedCartItem ? (
                    <div className="selected-item-card">
                       <img src={createForm.selectedCartItem.product.image} alt="sel" width="50" />
                       <div>
                          <p><strong>{createForm.selectedCartItem.product.name}</strong></p>
                          <p>Qty: {createForm.selectedCartItem.quantity} | Total: Rs. {createForm.selectedCartItem.product.price * createForm.selectedCartItem.quantity}</p>
                       </div>
                       <button onClick={() => setCreateForm({...createForm, selectedCartItem: null})}>Change</button>
                    </div>
                 ) : (
                    // THIS BUTTON NOW NAVIGATES TO CART PAGE
                    <button className="btn-choose-cart" onClick={handleGoToCartForSelection}>
                       Choose from Cart
                    </button>
                 )}
               </div>
             </div>

             <button className="btn-create-submit" onClick={initiateCreate}>Create & Pay</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Group;