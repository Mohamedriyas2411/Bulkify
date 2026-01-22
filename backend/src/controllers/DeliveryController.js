const Deliveryman = require('../models/Deliveryman');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');

exports.registerDeliveryman = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const{name, email, phone, password, location} = req.body;
    try{
        let deliveryman = await Deliveryman.findOne({email});
        if(deliveryman){
            return res.status(400).json({msg:'Deliveryman already exists with this email'});
        }
        deliveryman = new Deliveryman({
            name,
            email,      
            phone,
            password,
            location:{
                latitude: location.latitude,
                longitude: location.longitude
            }
        });
        const salt = await bcrypt.genSalt(10);  
        deliveryman.password = await bcrypt.hash(password, salt);
        await deliveryman.save();
        const payload = {
            deliveryman: {
                id: deliveryman.id  
            }
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: '1d'},
            (err, token) => {
                if(err) throw err;
                res.json({token});
            }
        );
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');   
    }
};
exports.loginDeliveryman = async (req, res) => {
    const {email,password} = req.body;
    try{
        let deliveryman = await Deliveryman.findOne({email});
        if(!deliveryman){
            return res.status(400).json({msg:'Deliveryman does not exist'});
        }
        const isMatch = await bcrypt.compare(password, deliveryman.password);
        if(!isMatch){
            return res.status(400).json({msg:'Invalid credentials'});
        }
        const payload = {
            deliveryman: {
                id: deliveryman.id
            }
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: '1d'},
            (err, token) => {   
                if(err) throw err;
                res.json({token});
            }

        );
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');   
    }   
};
        