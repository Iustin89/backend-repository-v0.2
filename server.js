// server.js

// CONFIGURARI/VARIABILE DE BAZA
// =====================================================================================================================================

// cream variabilele si apelam pachetele necesare aplicatiei
var express = require('express');                           // apelam pachetele definite in express
var app = express();                                        // definim explicit utilizarea functiilor express de care aplicatie
var bodyParser = require('body-parser');                    
var Product = require('./models/product');                  // explicit spunem ca vom folosi modelul creat 'product'
var mongoose = require('mongoose');                         // variabila necesara pt lucrul cu mongoDB  

// CONFIGURARI NECESARE LUCRULUI CU bodyParser() - ne va permite sa returnam data dintr-un POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('port', process.env.PORT || 3030);                  // setam un port definit de noi local 

// realizam conexiunea explicita la baza de date creata local                        
var url = 'mongodb://localhost:27017/productDB';
mongoose.connect(url);     

// DECLARARE DE RUTE/ROUTES PENTRU API
// ========================================================================================================================================
var router = express.Router();                               // crearea unei instante Router de tipul express

// middleware to use for all requests
router.use(function (req, res, next) {
    console.log('Ceva se intampla!');                       // are rolul de a afisa explicit un mesaj  
    next();                                                 // functia next() are rolul de a continua executia cu urmatoarea secventa de cod
});

// metoda de a testa daca ruta creata e corecta (accessed at GET http://localhost:3030/api)
router.get('/', function(req, res){
    res.json({ message: 'Bun venit pe APi-ul meu!' });
});

// declararea de rute care vor interactiona explicit cu modelul creat de noi - PRODUCT
// -----------------------------------------------------------------------------------------------------------------------------------------
var productRoute = router.route('/products')

// model de creare a unui produs (accessed at POST http://localhost:3030/api/products)
productRoute.post(function (req, res) {
        var product = new Product();    // cream o noua instanta de tipul PRODUCT
        product.name = req.body.name;   // setam numele produsului care va fi cel dat ca request                                        

        // salvam/inregistram produsul si testam eventuale erori la executie 
        product.save(function (err) {
            if (err)
                res.send(err);

            res.json({ message: 'Product creat!', data:product });
        });
});

// model de returnare a produselor create (accessed at GET http://localhost:3030/api/products)
productRoute.get(function (req, res) {
        Product.find(function(err, product){
            if (err)
                res.send(err);

            res.json(product);
        });
});

// declararea de rute care au ca terminatie '/:product_id'
// ----------------------------------------------------------------------------------------------------------------------------------------
var productRouteID = router.route('/products/:product_id')

// model de returnare a unui produs cu id-ul propriu (accessed at GET http://localhost:3030/api/products/:product_id)
productRouteID.get(function (req, res) {
    Product.findById(req.params.product_id, function (err, product) {
        if (err)
            res.send(err);
        res.json(product);
    })
});

// Cream/inregistram routerele(routes) 
// ==========================================================================================================================================
app.use('/api', router);                                            // rutele create vor fi prefixate cu '/api'

// START THE SERVER
// ==========================================================================================================================================
app.listen(app.get('port'));                                                   // 'ascultam' la portul predefinit de noi anterior
console.log('Comunicarea se realizeaza la portul ', app.get('port'));