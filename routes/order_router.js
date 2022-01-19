const orderModel = require('../models/order_model');
const productModel = require('../models/product_model');

var express = require('express');
const product_model = require('../models/product_model');
var router = express.Router();

router.get('/list', (req, res) => {
    orderModel.find((err, docs) => {
        if (err) return res.status(404).json({
            message: "Siparişlerin hepsini listeleme işlemi başarısız",
            hata: err.message
        });
        else return res.status(200).json({
            message: "Siparişlerin hepsini listeleme işlemi başarılı",
            data: {
                count: docs.length,
                orders: docs,
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/order/list" + docs._id
                }
            }
        })
    }).populate('productId','name');
    //populate işlemi ile ref ile atadığımız değeri komple iletmeyi ya da populate('productId','çağırmak istediğimiz proplar ') ile de istediğimi
    //propları çağırabiliriz.
});

router.post('/add', (req, res) => {
    //bu find by id işlemini eklediğimiz product ıd nin var olup olmadığına bakan bir validationdur.
    productModel.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }
        });

    let createData = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    var orders = new orderModel(createData);
    orders.save((err, doc) => {
        if (err) return res.status(404).json({
            message: "ekleme işlemi başarısız"
        });
        else return res.status(200).json({
            message: "sipariş ekleme işlemi başarılı",
            data: doc
        })
    })
});


router.put('/edit/:id', (req, res) => {
    var id = req.params.id;
    var updateData = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    orderModel.updateOne({ _id: id }, updateData, (err, doc) => {
        if (err) return res.status(404).json({
            message: "güncelleme işlemi başarısız"
        });
        else return res.status(200).json({
            message: "güncelleme işlemi başarılı",
            data: {
                productId: updateData.productId,
                quantity: updateData.quantity,
                request: {
                    type: 'PUT',
                    url: 'http://localhost:3000/order/edit/' + id
                }
            }
        });
    });
});

router.delete('/delete/:id', (req, res) => {
    var id = req.params.id;
    orderModel.deleteOne({ _id: id }, (err, doc) => {
        if (err) return res.status(404).json({
            message: "sipariş silme işlemi başarısız",
            hata: err
        });
        else return res.status(200).json({
            message: "sipariş silme işlemi başarılı",
        })
    });
});



module.exports = router;