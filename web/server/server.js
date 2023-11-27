const express = require('express');
const appController = require('./appController');
const path = require('path');
const cors = require('cors');
// Load environment variables from .env file
// Ensure your .env file has the required database credentials.
const loadEnvFile = require('./utils/envUtil');
const envVariables = loadEnvFile('../.env');

const app = express();
const PORT = envVariables.PORT || 65534;  // Adjust the PORT if needed (e.g., if you encounter a "port already occupied" error)

// Middleware setup
//app.use(express.static('public'));  // Serve static files from the 'public' directory
app.use(cors());
app.use(express.json());             // Parse incoming JSON payloads

// If you prefer some other file as default page other than 'index.html',
//      you can adjust and use the bellow line of code to
//      route to send 'DEFAULT_FILE_NAME.html' as default for root URL
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/DEFAULT_FILE_NAME.html');
// });

/*
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'../client/build/index.html'));
});
*/

// mount the router
app.use('/api', appController);


// ----------------------------------------------------------
// Starting the server
app.get('/pi/data',(req,res) => {
    const data = { message: "Hello from backend!" };
    res.json(data);
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

