const redis = require('redis');

class RedisClient{

    //TODO: add config here
    constructor(){
        this.client = redis.createClient()
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
        const newridejson = JSON.stringify(newrideObj)
        return this.client.set(rideId, newridejson)
    }

    async del(rideId){
        if( !this.client.isOpen){
            await this.client.connect()
        }
        return this.client.del(rideId)
    }
}

module.exports = { RedisClient }
