import React, { useState, useEffect } from 'react';
import BuyerNavbar from '../components/BuyerNavbar';
import { Search, Users } from 'lucide-react'; // 'Users' icon for the community avatar
import './Community.css';

const Community = () => {
  const [activeTab, setActiveTab] = useState('recommended'); // 'recommended', 'joined', 'create'
  
  // Data States
  const [nearbyCommunities, setNearbyCommunities] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  
  // Create Form State
  const [createForm, setCreateForm] = useState({ name: '', area: '' });
  const [loading, setLoading] = useState(false);
  

  // --- FETCHING DATA ---
  const fetchNearby = async () => {
    const token = localStorage.getItem('buyerToken');
    try {
      const res = await fetch('http://localhost:5000/api/communities/nearby', {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      setNearbyCommunities(data);
    } catch (err) { console.error(err); }
  };

  const fetchJoined = async () => {
    const token = localStorage.getItem('buyerToken');
    try {
      const res = await fetch('http://localhost:5000/api/communities/joined', {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      setJoinedCommunities(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (activeTab === 'recommended') fetchNearby();
    if (activeTab === 'joined') fetchJoined();
  }, [activeTab]);


  // --- HANDLERS ---
  const handleJoin = async (id) => {
    const token = localStorage.getItem('buyerToken');
    try {
      await fetch(`http://localhost:5000/api/communities/join/${id}`, {
        method: 'PUT',
        headers: { 'x-auth-token': token }
      });
      fetchNearby(); // Refresh list
      alert("Joined successfully!");
    } catch (err) { console.error(err); }
  };

  const handleLeave = async (id) => {
    if(!window.confirm("Are you sure you want to leave this community?")) return;
    const token = localStorage.getItem('buyerToken');
    try {
      await fetch(`http://localhost:5000/api/communities/leave/${id}`, {
        method: 'PUT',
        headers: { 'x-auth-token': token }
      });
      fetchJoined(); // Refresh list
    } catch (err) { console.error(err); }
  };

  const handleCreate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const token = localStorage.getItem('buyerToken');
      const payload = {
        name: createForm.name,
        area: createForm.area,
        location: {
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }
      };

      try {
        const res = await fetch('http://localhost:5000/api/communities/create', {
          method: 'POST',
          headers: {
             'Content-Type': 'application/json',
             'x-auth-token': token
          },
          body: JSON.stringify(payload)
        });
        
        if (res.ok) {
          alert("Community Created!");
          setCreateForm({ name: '', area: '' });
          setActiveTab('joined'); // Switch to joined tab to see it
        }
      } catch (err) { console.error(err); }
    }, (err) => alert("Location access needed to create a community"));
  };

  return (
    <div className="community-container">
      <BuyerNavbar />
      
      {/* Orange Header with Search */}
      <div className="cart-header-strip">
        <div className="header-search-wrapper">
           <input type="text" placeholder="Search communities" className="header-search-input" />
           <Search className="header-search-icon" size={20} />
        </div>
      </div>

      <div className="community-content">
        
        {/* TABS */}
        <div className="community-tabs">
          <button 
            className={`comm-tab-btn ${activeTab === 'recommended' ? 'orange-active' : 'grey-inactive'}`}
            onClick={() => setActiveTab('recommended')}
          >
            Recommended
          </button>
          
          <button 
            className={`comm-tab-btn ${activeTab === 'joined' ? 'orange-active' : 'grey-inactive'}`}
            onClick={() => setActiveTab('joined')}
          >
            Joined
          </button>

          <button 
            className={`comm-tab-btn ${activeTab === 'create' ? 'orange-active' : 'grey-inactive'}`}
            onClick={() => setActiveTab('create')}
          >
            Create
          </button>
        </div>

        {/* --- VIEW: RECOMMENDED --- */}
        {activeTab === 'recommended' && (
          <div className="community-list">
            <h3 className="list-title">Top communities nearest to you</h3>
            
            {nearbyCommunities.length === 0 ? <p>No new communities nearby.</p> : 
              nearbyCommunities.map(comm => (
                <div key={comm._id} className="community-card">
                  <div className="comm-info">
                    <Users size={40} />
                    <div className="comm-text">
                      <h4>Name: {comm.name}</h4>
                      <p>Area: {comm.area}</p>
                    </div>
                  </div>
                  <button className="btn-join" onClick={() => handleJoin(comm._id)}>Join</button>
                </div>
              ))
            }
          </div>
        )}

        {/* --- VIEW: JOINED --- */}
        {activeTab === 'joined' && (
          <div className="community-list">
             {/* Reusing 'Joined' header from your image if needed, or just listing them */}
             {joinedCommunities.length === 0 ? <p>You haven't joined any communities yet.</p> : 
              joinedCommunities.map(comm => (
                <div key={comm._id} className="community-card">
                  <div className="comm-info">
                    <Users size={40} />
                    <div className="comm-text">
                      <h4>Name: {comm.name}</h4>
                      <p>Area: {comm.area}</p>
                    </div>
                  </div>
                  {/* The button says "Left" in your image for leaving */}
                  <button className="btn-left" onClick={() => handleLeave(comm._id)}>Left</button>
                </div>
              ))
            }
          </div>
        )}

        {/* --- VIEW: CREATE --- */}
        {activeTab === 'create' && (
          <div className="create-community-form">
            <div className="form-field">
              <label>Name of the Community</label>
              <input 
                type="text" 
                value={createForm.name} 
                onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
              />
            </div>

            <div className="form-field">
              <label>Area</label>
              <input 
                type="text" 
                value={createForm.area} 
                onChange={(e) => setCreateForm({...createForm, area: e.target.value})}
              />
            </div>

            <button className="btn-create-submit" onClick={handleCreate}>
              Create
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Community;