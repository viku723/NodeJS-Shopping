const Product = require('../models/product');
const Cart = require('../models/cart');

module.exports.getProducts = (req, res, next) => {
    Product.fetchAllProducts().then((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
          });
    }).catch();
}
module.exports.getProduct = (req, res, next) => {
    Product.getProductById(req.params.productId).then((product) => {
        res.render('shop/product-details', {
            product,
            pageTitle: product.title,
            path: '/products'
        });
    });
}
module.exports.getCart = (req, res, next) => {
    Cart.getCart().then((cart) => {
        Product.fetchAllProducts().then((products) => {
            const cartProducts = [];
            products.forEach((product) => {
                const cartProduct = cart.products.find(p => product.id == p.id);
                if (cartProduct) {
                    cartProducts.push({
                        product,
                        qty: cartProduct.qty
                    });
                }
            });
            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/cart',
                cartProducts
            })
        })
    });
}
module.exports.postCart = (req, res, next) => {
    console.log('pid', req.body.productId);
    Product.getProductById(req.body.productId).then((product) => {
        Cart.addProduct(req.body.productId, product.price);
    })
    res.redirect('/cart')
}

module.exports.deleteCartProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.getProductById(productId).then((product) => {
        Cart.deleteCartProduct(productId, product.price);
        res.redirect('/cart');
    })
}
module.exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
}
module.exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders'
    });
}
module.exports.getIndex = (req, res, next) => {
    Product.fetchAllProducts().then((products) => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
          });
    }).catch();
}
