var mongoose = require('mongoose');
//var Schema = mongoose.Schema;

var ProductSchema = new mongoose.Schema({
    name: String
});

module.exports = mongoose.model('Product', ProductSchema);