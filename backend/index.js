const express = require('express');
const app = express();
require('dotenv').config();
require('./Models/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter=require('./Routes/authRouter')
const productRouter = require('./Routes/productRouter');

const port =  5000; // Make sure your .env uses PORT (not lowercase)
 
app.use(cors());
app.use(bodyParser.json());

// Available Routes
app.use('/auth', AuthRouter);
app.use('/products', productRouter);

app.get('/', (req, res) => {
    res.send('Ping Pong');
});

app.listen(port, () => {
    console.log(`🚀 Server is running on port: ${port}`); 
});