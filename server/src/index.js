const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const accountController = require('./controllers/accounts'); // Import the account controller
const rideController = require('./controllers/ride'); // Import the account controller

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors())
app.use(bodyParser.json());

// Use the account controller for handling user registration
app.use('/account', accountController);
app.use('/ride', rideController);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
