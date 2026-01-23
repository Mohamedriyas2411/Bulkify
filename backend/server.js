const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const sellerRoutes = require('./src/routes/sellerRoutes');
const productRoutes = require('./src/routes/productRoutes');
const buyerRoutes = require('./src/routes/buyerRoutes');
const deliverymanRoutes = require('./src/routes/deliverymanRoutes');



const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));    

app.use('/api/sellers', sellerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/deliverymen', deliverymanRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});