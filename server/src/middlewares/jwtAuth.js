const jwt = require('jsonwebtoken');

//you can access user.id and user.role in later middlewares
function jwtAuth(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    const tokenParts = token.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
    }

    jwt.verify(tokenParts[1], 'your-secret-key', (err, token_payload) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }

        req.user_id = token_payload.user_id;
        req.role = token_payload.role;
        req.ride_id = token_payload.ride_id;


        next();
    });
}

module.exports = { jwtAuth };
