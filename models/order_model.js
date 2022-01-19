const mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product',
        requried:true
    },
    quantity:Number
})

module.exports = mongoose.model('orderModel',orderSchema);
