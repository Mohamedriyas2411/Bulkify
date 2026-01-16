const Seller = require('../models/Seller');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');

exports.registerSeller = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const{shopName, email, phone, password, location} = req.body;

    try{
        let seller = await Seller.findOne({email});
        if(seller){
            return res.status(400).json({msg:'Seller already exists with this email'});
        }

        seller = new Seller({
            shopName,
            email,
            phone,
            password,
            location:{
                latitude: location.latitude,
                longitude: location.longitude   

            }
        });

        const salt = await bcrypt.genSalt(10);
        seller.password = await bcrypt.hash(password, salt);
        await seller.save();
        const payload = {
            seller: {
                id: seller.id
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

exports.loginSeller = async (req, res) => {
    const{email, password} = req.body;

    try{
        let seller = await Seller.findOne({email});
        if(!seller){
            return res.status(400).json({msg:'Invalid Credentials'});
        }
        const isMatch = await bcrypt.compare(password, seller.password);
        if(!isMatch){
            return res.status(400).json({msg:'Passworrd is incorrect'});
        }

        const payload = {
            seller: {
                id: seller.id
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