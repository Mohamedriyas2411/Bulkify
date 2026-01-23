const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // 1. Get token from header
    const token = req.header('x-auth-token');

    // 2. Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // 3. Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Critical Check: Ensure the token actually belongs to a Buyer
        if (!decoded.buyer) {
             return res.status(401).json({ msg: 'Authorization denied: Not a Buyer account' });
        }

        req.buyer = decoded.buyer; // Assign the payload to req.buyer
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};