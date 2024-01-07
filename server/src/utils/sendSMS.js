const accSid = 'ACc1268054dc3c615a9449afa3d73f4134'
const authToken = 'f8577ced86310ce9d8d61081d1422359'
const twilioClient = require('twilio')(accSid, authToken)


function sendSMS(traveller_name, contact_number, ride_link){
    twilioClient.messages
        .create({
            body: `Your friend ${traveller_name} shared his ride with out. 
            Click here to track their ride: ${ride_link}`,
            from: '+12017205537',
            to: contact_number
        })
        .then(message => console.log(message.sid))
}

module.exports = {sendSMS}
