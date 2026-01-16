import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './ProductModal.css';

const ProductModal = ({ isOpen, onClose, onSave, productToEdit }) => {
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    minQuantity: '',
    discount: '',
    image: '' // Will store base64 string
  });

  // Populate form if editing
  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit);
    } else {
      // Reset if adding new
      setFormData({
        name: '', quantity: '', price: '', minQuantity: '', discount: '', image: ''
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Upload (Convert to Base64)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Send data back to parent
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          {/* Change Title based on mode */}
          <h2>{productToEdit ? 'Edit Product' : 'List Product'}</h2>
          <button onClick={onClose} className="close-btn"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Product Name</label>
            <input name="name" value={formData.name} onChange={handleChange} className="modal-input" required />
          </div>

          <div className="form-group">
            <label>Quantity (Total)</label>
            <input name="quantity" value={formData.quantity} onChange={handleChange} className="modal-input" required />
          </div>

          <div className="form-group">
            <label>Price (Rs.)</label>
            <input name="price" type="number" value={formData.price} onChange={handleChange} className="modal-input" required />
          </div>

          <div className="form-group">
            <label>Min Quantity (for Bulk)</label>
            <input name="minQuantity" type='number' value={formData.minQuantity} onChange={handleChange} className="modal-input" required />
          </div>

          <div className="form-group">
            <label>Discount Percentage for Bulk Order</label>
            <input name="discount" type="number" value={formData.discount} onChange={handleChange} className="modal-input" />
          </div>

          {/* Image Upload Section */}
          <div className="form-group image-upload-group">
            <label htmlFor="file-upload" className="image-select-btn">
              select image
            </label>
            <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} style={{display: 'none'}} />
            
            <span className="image-status">
              {formData.image ? "Image Selected ✓" : "No image selected"}
            </span>
          </div>

          {/* Submit Button - Changes Text */}
          <button type="submit" className="modal-submit-btn">
            {productToEdit ? 'Edit' : 'Add'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;