var mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userModel = require('../models/user_model');


router.post('/signup', (req, res) => {
    userModel.find({ email: req.body.email }).then(result => {
        // bu işlem e posta dan 1 den fazla varsa hata verme işlemidir
        if (result.length >= 1) return res.status(500).json({
            message: "Email daha önceden var"
        })
        else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) return res.status(500).json({
                    error: err.message
                })
                else {
                    const user = new userModel({
                        email: req.body.email,
                        password: hash
                    });
                    user.save().then(result => {
                        console.log(result);
                        res.status(200).json({
                            message: 'kullanıcı oluşturuldu.'
                        })
                    })
                        .catch(err => res.status(500).json({
                            message: " kullanıcı oluşturulamadı",
                            hata: err.message
                        }));
                }
            })
        }
    });
});

router.post('/login', (req, res) => {
    userModel.find({ email: req.body.email }).then(result => {
        if (result.length < 1) return res.status(401).json({
            message: "giriş yapılamadı. Böyle bir kayıt yoktur."
        })
        bcrypt.compare(req.body.password, result[0].password, (err, doc) => {
            if (err) return res.status(401).json({
                message: "Giriş yapılamadı",
                hata: err.message
            });
            if (doc) {
                const token = jwt.sign({
                    email: result[0].email,
                    _id: result[0]._id,
                },
                    process.env.JWT_KEY,
                    {
                        expiresIn: '1h'
                    }
                )
                res.status(200).json({
                    message: "Giriş başarıyla yapıldı",
                    token: token
                })
            }
            else return res.status(401).json({
                message: "Giriş yapılamadı"
            })
        })
    })  
})

router.delete('/delete/:userId', (req, res) => {
    var id = req.body.userId;
    userModel.deleteOne({ _id: id }, (err, doc) => {
        if (err) return res.status(500).json({
            message: " kullanıcı silme işlemi başarısız",
            Hata: err.message
        });
        else return res.status(200).json({
            message: "kullanıcı başarıyla silindi",
        });
    })
})

module.exports = router;