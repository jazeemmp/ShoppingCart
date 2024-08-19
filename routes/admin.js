const express = require("express");
const router = express.Router();
const ProductDB = require("../model/productModel");
const adminController = require("../controller/adminController")
const upload = require('../config/multer/multer')

router.get("/",adminController.getProducts);
router.get("/add-products",adminController.getAddProducts);
router.post("/add-product", upload.array('images'),adminController.postAddProducts);
router.get("/delete-product/:id",adminController.deleteProduct)
router.get("/edit-product/:id",adminController.editProduct)
router.post("/edit-product/:id",upload.array('images'),adminController.postEditProduct)
module.exports = router;


module.exports = router;
