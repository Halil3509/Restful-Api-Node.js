var productModel = require('../models/product_model');
var express = require('express');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  // indirilen dosyaları tutan klasör yarattık.
  // dest kısmını yukardaki gibi dest: 'uploads/' olarak yaparsak resim şifreli depolanır bunu engelleme için storage oluşturup onu eklemeliyiz.
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});


var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/list', checkAuth, (req, res) => {
  productModel.find((err, docs) => {
    if (err) return res.status(404).json({
      message: "Ürünleri listeleme işlemi başarısız",
    });
    else return res.status(200).json({
      message: "ürünleri listeleme işlemi başarılı",
      data: {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            surname: doc.surname,
            productImage: doc.productImage,
            _id: doc._id,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/list/' + doc._id
            }
          }
        })
      }
    });
  });
});


router.post('/add', checkAuth, upload.single('productImage'), (req, res) => {
  console.log(req.file);
  let data = {
    name: req.body.name,
    surname: req.body.surname,
    productImage: req.file.path
  }
  var products = new productModel(data);
  products.save((err, doc) => {
    if (err) return res.status(404).json({
      message: "işlem başarısız"
    })
    else return res.status(200).json({
      message: "işlem başarılı",
      data: {
        name: doc.name,
        surname: doc.surname,
        _id: doc._id,
        request: {
          type: 'POST',
          url: 'http:://localhost:3000/add/' + doc._id
        }
      }
    })
  });
});

router.put('/edit/:id', checkAuth, (req, res) => {
  let updatedData = {
    name: req.body.name,
    surname: req.body.surname
  }
  var id = req.params.id;
  productModel.updateOne({ _id: id }, updatedData, (err, doc) => {
    if (err) return res.status(404).json({
      message: "güncelleme işlemi başarısız",
    })
    else return res.status(200).json({
      message: "güncelleme işlemi başarılı",
      updatedProduct: {
        name: doc.name,
        surname: doc.surname,
        _id: doc._id,
        request: {
          type: 'POST',
          url: 'http:://localhost:3000/edit'
        }
      }
    });
  });
});

router.patch('/edit2/:id', checkAuth, (req, res) => {
  let updatedData = {
    name: req.body.name,
    surname: req.body.surname
  }
  var id = req.params.id;
  productModel.updateOne({ _id: id }, updatedData, (err, doc) => {
    if (err) return res.status(404).json({
      message: "güncelleme işlemi başarısız",
    })
    else return res.status(200).json({
      message: "güncelleme işlemi başarılı",
      newdata: {
        request: {
          type: 'POST',
          url: 'http:://localhost:3000/edit2'
        }
      }
    });
  });
});

router.delete('/delete/:id', checkAuth, (req, res) => {
  var id = req.params.id;
  productModel.deleteOne({ _id: id }, (err, doc) => {
    if (err) return res.status(404).json({
      message: "silme işlemi başarısız"
    });
    else return res.status(200).json({
      message: "silme işlemi başarılı",
      request: {
        type: 'POST',
        url: 'http:://localhost:3000/delete'
      }
    });
  });
});


router.get('/list/:id', (req, res) => {
  var id = req.params.id;
  productModel.findById(id, (err, doc) => {
    if (err) return res.status(404).json({
      message: "İd ile getirme işlemi başarılı"
    });
    else return res.status(200).json({
      message: "Id ile getirme işlemi başarılı",
      data: {
        name: doc.name,
        surname: doc.surname,
        _id: doc._id,
        request: {
          type: 'GET',
          description: "good product",
          url: 'http://localhost:3000/list/' + doc._id
        }
      }
    })
  })
})

module.exports = router;
