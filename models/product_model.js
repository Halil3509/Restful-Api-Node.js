var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name:{type:String, required:true},
    surname:{type:String, required:true},
    productImage: { type: String, required: true }
});

module.exports = mongoose.model('product',productSchema);