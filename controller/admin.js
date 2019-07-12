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
    Product.getProductById(req.params.productId).then(product => {
        res.render('admin/edit-product', {
            product,
            pageTitle: 'Edit product',
            path: '/admin/edit-product',
            editMode: editMode
        });
    }).catch()
};
module.exports.addProduct = (req, res, next) => {
    const product = new Product(req.body.title, req.body.imageUrl, req.body.price, req.body.description, req.user._id);
    product.addProduct().then(() => {
        res.redirect('/');
        console.log('Product created');
    }).catch((err) => {
        console.log('Error while adding product', err);
    });
}
module.exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll()
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
    Product.updateProduct(productId, {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        description: req.body.description,
    })
        .then(() => {
            console.log('Product updated');
            res.redirect('/admin/products');
        }).catch((err) => {
            console.log('Error while updating product', err);
        })
}
module.exports.deleteProduct = (req, res, next) => {
    Product.deleteProductById(req.body.productId).then(() => {
        console.log('Product deleted');
        res.redirect('/admin/products');
    }).catch();
}