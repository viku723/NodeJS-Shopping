const Product = require('../models/product');

module.exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add product',
        path: '/admin/add-product',
        editMode: false
    });
};
module.exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit === 'true';
    Product.getProductById(req.params.productId).then((product) => {
        res.render('admin/edit-product', {
            product,
            pageTitle: 'Edit product',
            path: '/admin/edit-product',
            editMode: editMode
        });
    });
};
module.exports.addProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null, title, imageUrl, description, price);
    product.save().then(() => {
        res.redirect('/');
    }).catch((err) => {
        console.log('Error while adding book', err);
    });
}
module.exports.getAdminProducts = (req, res, next) => {
    Product.fetchAllProducts().then((products) => {
        res.render('admin/products', {
            pageTitle: 'Admin Products',
            path: '/admin/products',
            prods: products
        });
    })
}
module.exports.editPostProduct = (req, res, next) => {
    const productId = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(productId, title, imageUrl, description, price);
    product.save();
    res.redirect('/admin/products');
}
module.exports.deleteProduct = (req, res, next) => {
    Product.deleteProduct(req.body.productId);
    res.redirect('/admin/products');
}