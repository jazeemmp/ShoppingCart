const express = require('express');
const router = express.Router();
const productController = require('../controller/productController')
const userControl = require('../controller/userControler')
const middle = require('../middlewares/userMiddlewares')
const cartControl = require('../controller/cartController')
const orderControl = require('../controller/orderController')

router.get('/',productController.getProducts);
router.get('/signup',userControl.getSignup)
router.get('/login',userControl.getLogin)
router.post('/signup',userControl.postSignup)
router.post('/login',userControl.postLogin)
router.get('/logout',userControl.getLogout)
router.get('/cart',middle.isLogined,cartControl.getCart)
router.get('/product-details/:id',productController.getProductDetails)
router.post('/add-to-cart',middle.ajaxisLogined,cartControl.addToCart)
router.get('/remove-cart-product/:id',middle.isLogined,cartControl.removeProduct)
router.post('/change-product-quantiy',cartControl.changeProductQuantity)
router.get('/place-order',middle.isLogined,orderControl.getPlaceOrder)
router.post('/add-address',orderControl.addAddress)
router.post('/place-order',orderControl.postPlaceOrder)
router.get('/orders',middle.isLogined,orderControl.getOrders)
router.get('/orders/view-details/:id',orderControl.getOrderDetails)
router.post('/get-otp',userControl.getOtp)
router.post('/verify-otp',userControl.verifyOtp)
router.get('/my-profile',middle.isLogined,userControl.getMyProfile)
router.post('/verify-payment',orderControl.verifyPayment)
router.post('/cancel-order/:id',orderControl.cancelOrder)

module.exports = router;
