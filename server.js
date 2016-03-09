﻿// server.js

// BASE SETUP
// ===================================================================================

// call the packages we need
var express = require('express');       // call express
var mongoose = require('mongoose');
var app = express();                    // define our app using express
var bodyParser = require('body-parser');
var Product = require('./models/product');

// our array
mongoose.connect('mongodb://localhost:27017/productDB'); 


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var port = process.env.Port || 8080;    // set our port

// ROUTES FOR OUR API
// ======================================================================================
var router = express.Router();          // get an instance of the express Router

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('Ceva se intampla!');
    next();                             // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res){
    res.json({ message: 'Bun venit pe APi-ul meu!' });
});

// more routes for our API will happen here
// on routes that and in /product
// ---------------------------------------------------------------------------------------
router.route('/products')

// create a product (accessed at POST http://localhost:8080/api/product)
    .post(function (req, res) {
        var product = new Product();    // create a new instance of the Product model
        product.name = req.body.name;   // set the product name (comes from the request)

        // save the product and check for errors
        product.save(function (err) {
            if (err)
                res.send(err);

            res.json({ message: 'Product creat!' });
        });
    });

// REGISTER OUR ROUTES
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =======================================================================================
app.listen(port);
console.log('Comunicarea se realizeaza la portul ', port);