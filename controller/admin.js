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
    req.user.getProducts({
        where: {
            id: req.params.productId
        }
    }).then(products => {
        const product = products[0];
        res.render('admin/edit-product', {
            product,
            pageTitle: 'Edit product',
            path: '/admin/edit-product',
            editMode: editMode
        });
    }).catch()
};
module.exports.addProduct = (req, res, next) => {
    req.user.createProduct({
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        description: req.body.description
    }).then(() => {
        res.redirect('/');
        console.log('Product created');
    }).catch((err) => {
        console.log('Error while adding book', err);
    });
}
module.exports.getAdminProducts = (req, res, next) => {
    req.user.getProducts()
    //Product.findAll()
    .then((products) => {
        res.render('admin/products', {
            pageTitle: 'Admin Products',
            path: '/admin/products',
            prods: products
        });
    })
}
module.exports.editPostProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByPk(productId).then((product) => {
        product.title = req.body.title;
        product.imageUrl = req.body.imageUrl;
        product.price = req.body.price;
        product.description = req.body.description;
        return product.save();
    }).then(() => {
        console.log('Product updated');
        res.redirect('/admin/products');
    }).catch((err) => {
        console.log('Error while updating product', err);
    })

}
module.exports.deleteProduct = (req, res, next) => {
    Product.destroy({
        where: {
            id: req.body.productId
        }
    }).then(() => {
        console.log('Product deleted');
        res.redirect('/admin/products');
    }).catch();
}