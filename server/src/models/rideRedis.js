const redis = require('redis');

class RedisClient{

    //TODO: add config here
    constructor(){
        this.client = redis.createClient()
    }

    async getAll(){
        if( !this.client.isOpen){
            await this.client.connect()
        }

        //TODO: This might make client slow
        const keys = await this.client.keys('*')

        const values = await Promise.all(keys.map(async (key) => {
            const val = await this.client.get(key);
            return { [key]: JSON.parse(val) };
        }));

        return values

    }

    async get(rideId) {
        if( !this.client.isOpen){
            await this.client.connect()
        }
        return this.client.get(rideId).then(val => JSON.parse(val))
    }

    async set(rideId, rideObj){
        if( !this.client.isOpen){
            await this.client.connect()
        }
        const ridejson = JSON.stringify(rideObj)
        return this.client.set(rideId, ridejson)
    }

    async update(rideId, newrideObj){
        if( !this.client.isOpen){
            await this.client.connect()
        }

        let ride = await this.get(rideId)
        Object.entries(ride_updates).forEach(([key, value]) => {
            ride[key] = value
        });
        console.log(rideId, ride)

        return this.client.set(rideId, JSON.stringify(ride))
    }

    async del(rideId){
        if( !this.client.isOpen){
            await this.client.connect()
        }
        return this.client.del(rideId)
    }
}

module.exports = { RedisClient }
