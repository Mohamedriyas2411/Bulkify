const Buyer = require('../models/Buyer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');

exports.registerBuyer = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const{name, email, phone, password, location} = req.body;

    try{
        let buyer = await Buyer.findOne({email});
        if(buyer){
            return res.status(400).json({msg:'Buyer already exists with this email'});

        }
        buyer = new Buyer({
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
        buyer.password = await bcrypt.hash(password, salt);
        await buyer.save();
        const payload = {
            buyer: {
                id: buyer.id
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

exports.loginBuyer = async (req, res) => {
    const {email,password} = req.body;
    try{
        let buyer = await Buyer.findOne({email});
        if(!buyer){
            return res.status(400).json({msg:'Buyer does not exist'});
        }
        const isMatch = await bcrypt.compare(password, buyer.password);
        if(!isMatch){
            return res.status(400).json({msg:'Invalid Password'});
        }
        const payload = {
            buyer: {
                id: buyer.id
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
            


    }   };
