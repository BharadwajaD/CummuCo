const express = require('express');
const { RedisClient } = require('../models/rideRedis');
const jwt = require('jsonwebtoken');
const {jwtAuth} = require('../middlewares/jwtAuth');
const db = require('../models/db'); 
const { sendSMS } = require('../utils/sendSMS');

//TODO: use pool of clients here
const redisClient = new RedisClient()

const router = express.Router();


//creates new ride object
router.post('/', jwtAuth, async (req, res) => {
    try {

        const ride = req.body;
        const ride_id = await db.insertRide(JSON.stringify(ride)).then(r => r.rideId)

        //the caller of this endpoint will be the traveller
        const tokenPayload = await db.insertUserRole(req.user_id, ride_id, 'traveller')
        const token = jwt.sign(tokenPayload, 'your-secret-key', { expiresIn: '10h' });

        await redisClient.set(ride_id, ride)

        const user = await db.getUserName(req.user_id)
        //sendSMS(user.username, ride.companion_number, `http://127.0.0.1:3000/ride/${ride_id}?share=true`)

        res.status(201).json({ token, rideId: ride_id });


    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//admin access
router.get('/', jwtAuth ,async (req, res) => {

    if (req.role != 'admin'){
        return res.status(403).json({message: 'requires admin access'})
    }
    redisClient.getAll()
        .then(dict => res.json(dict))
        .catch(err => res.status(500).json({message: err.message}))
})


//updates the exisiting ride object
//only traveller of this ride can access this api
router.post('/:id', jwtAuth, async (req, res) => {

    if(!db.isValidRole(req.user_id, req.ride_id, 'traveller')){
        return res.status(403).json({message: 'requires traveller access'})
    }

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
//only traveller and companian of this ride can access this endpoint
router.get('/:id', jwtAuth, async (req, res) => {

    const ride_id = req.params.id;
    const {share} = req.query;

    let token
    //insert companian into the db
    if(share === 'true'){
        const tokenPayload = await db.insertUserRole(req.user_id, ride_id, 'companion')
        token = jwt.sign(tokenPayload, 'your-secret-key', { expiresIn: '10h' });
        return res.send({token})
    }

    const isCompanion = await db.isValidRole( req.user_id, req.ride_id, 'companion')
    const isTraveller = await db.isValidRole( req.user_id, req.ride_id, 'traveller')
    if(!isTraveller && !isCompanion){
        console.log('forbidden', req.user_id, req.ride_id, req.role)
        return res.status(403).json({message: 'requires traveller or companion access'})
    }

    redisClient.get(ride_id)
        .then(ride => {
            if(!token) res.json(ride)
            else res.json({token, ride})
        })
        .catch( err =>  res.status(500).json({ message: err.message }))
});

//deletes the ride info
//only traveller of this ride can access this api
router.delete('/:id', async (req, res) => {
    const rideId = req.params.id;

    if(!db.isValidRole(req.user_id, req.ride_id, 'traveller')){
        return res.status(403).json({message: 'requires traveller access'})
    }

    redisClient.del(rideId)
        .then(() => res.json({ message: 'Ride deleted successfully', rideId }))
        .catch (err =>  res.status(500).json({ message: err.message }))
    
});

module.exports = router;

