const express = require('express');
const path = require('path');
const rootDir = require('../util/path');
const router = express.Router();

const adminController = require('../controller/admin');

router.get('/add-product', adminController.getAddProduct);
router.post('/add-product', adminController.addProduct);
router.get('/edit-product/:productId', adminController.getEditProduct);
router.post('/edit-product', adminController.editPostProduct);
router.get('/products', adminController.getAdminProducts);
router.post('/delete-product', adminController.deleteProduct);

module.exports = router;