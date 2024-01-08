const accSid = process.env.ACCSID
const authToken = process.env.AUTH_TOKEN
const twilioClient = require('twilio')(accSid, authToken)


function sendSMS(traveller_name, contact_number, ride_link){
    twilioClient.messages
        .create({
            body: `Your friend ${traveller_name} shared his ride with you. Click on the link to track their ride: ${ride_link}`,
            from: '+12017205537',
            to: contact_number
        })
        .then(message => console.log(message.sid))
}

module.exports = {sendSMS}
