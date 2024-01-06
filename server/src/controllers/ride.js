const express = require('express');
const { RedisClient } = require('../models/rideRedis');

//TODO: use pool of clients here
const redisClient = new RedisClient()

const router = express.Router();

//creates new ride object
router.post('/', async (req, res) => {
    try {
        const rideId = generateRideId();
        const rideObject = req.body;

        await redisClient.set(rideId, rideObject)
        res.status(201).json({ message: 'Ride created successfully', rideId });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//updates the exisiting ride object
router.post('/:id', async (req, res) => {

    const rideId = req.params.id;
    const updatedRideObject = req.body;

    try {

        await redisClient.update(rideId, updatedRideObject)
        res.json({ message: 'Ride updated successfully', rideId });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//fetches the latest info of the ride object
router.get('/:id', async (req, res) => {
    const rideId = req.params.id;

    try {
        console.log(rideId)
        const rideObject = await redisClient.get(rideId);
        res.json(rideObject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//deletes the ride info
router.delete('/:id', async (req, res) => {
    const rideId = req.params.id;

    try {
        await redisClient.del(rideId);
        res.json({ message: 'Ride deleted successfully', rideId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

function generateRideId() {
    return 'ride_' + Math.random().toString(36).substr(2, 9);
}

module.exports = router;

