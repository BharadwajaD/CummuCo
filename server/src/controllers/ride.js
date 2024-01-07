const express = require('express');
const { RedisClient } = require('../models/rideRedis');
const {jwtAuth} = require('../middlewares/jwtAuth');

//TODO: use uid generator to avoid overflow
let ride_count = 0

//TODO: use pool of clients here
const redisClient = new RedisClient()

const router = express.Router();

//TODO: The following endpoints should be allowed only for traveller/companion of that ride

//creates new ride object
router.post('/', async (req, res) => {
    try {
        const rideId = generateRideId();
        const ride_updates = req.body;
        let ride = await redisClient.get(rideId)

        console.log(ride)
        Object.entries(ride_updates).forEach(([key, value]) => {
            ride[key] = value
        });
        console.log(ride)

        await redisClient.set(rideId, ride)
        res.status(201).json({ message: 'Ride created successfully', rideId });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//admin access
router.get('/', jwtAuth ,async (req, res) => {
    const role = req.role
    if (role != 'admin'){
        res.status(403).json({message: 'requires admin access'})
    }
    redisClient.getAll()
        .then(dict => res.json(dict))
        .catch(err => res.status(500).json({message: err.message}))
})


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
//TODO: handle if rideId is not found
router.get('/:id', async (req, res) => {
    const rideId = req.params.id;

    redisClient.get(rideId)
        .then(rideObject => res.json(rideObject))
        .catch( err =>  res.status(500).json({ message: err.message }))
});

//deletes the ride info
router.delete('/:id', async (req, res) => {
    const rideId = req.params.id;

    redisClient.del(rideId)
        .then(() => res.json({ message: 'Ride deleted successfully', rideId }))
        .catch (err =>  res.status(500).json({ message: err.message }))
    
});

function generateRideId() {
    ride_count += 1
    return 'ride_' + ride_count.toString()
}

module.exports = router;

