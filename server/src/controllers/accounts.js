const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../models/db'); // Import the database module
const { jwtAuth } = require('../middlewares/jwtAuth');

const router = express.Router();

router.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    try {
        const tokenPayload = await db.getUser(username, password);
        console.log('signin: ', tokenPayload)
        const token = jwt.sign(tokenPayload, 'your-secret-key', { expiresIn: '10h' });
        res.send({ token: token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        await db.setUser(username, password);
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/role', jwtAuth, (req, res) => {
    res.send({role: req.role})
})

module.exports = router;

