const express = require('express');

const shopController = require('../controller/shop');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.post('/delete-cart', shopController.deleteCartProduct);
router.get('/checkout', shopController.getCheckout);
router.get('/orders', shopController.getOrders);
router.post('/create-order', shopController.createOrder);

module.exports = router;