const Product = require('../models/product');
const User = require('../models/user');
const mongoDb = require('mongodb');

module.exports.getProducts = (req, res, next) => {
    Product.fetchAll().then((products) => {
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
    Product.getCartProducts(req.user).then((products) => {
        console.log('Cartproducts', products)
        res.render('shop/cart', {
            pageTitle: 'Cart',
            path: '/cart',
            cartProducts: products
        })
    })
}
module.exports.postCart = (req, res, next) => {
    User.getUserById(req.user._id)
        .then((user) => {
            let updatedCart;
            if (!user.cart) {
                updatedCart = {
                    items: [{
                        productId: req.body.productId,
                        quantity: 1
                    }]
                }
            } else {
                updatedCart = { ...user.cart };
                const existingProduct = user.cart.items.filter((item) => {
                    return item.productId == req.body.productId;
                })[0];
                if (existingProduct) {
                    const existingProductIndex = user.cart.items.findIndex((item) => {
                        return item.productId == req.body.productId;
                    });
                    updatedCart.items[existingProductIndex].quantity = existingProduct.quantity + 1;
                } else {
                    updatedCart.items.push({
                        productId: req.body.productId,
                        quantity: 1
                    });
                }
            }
            console.error('updatedCart', updatedCart)
            User.addToCart(updatedCart, req.user._id).then(() => {
                console.log('Cart added')
                res.redirect('/cart');
            })
            .catch((err) => {
                console.log('Failed to add Cart', err);
            })
        })
        .catch()
}

module.exports.createOrder = (req, res, next) => {
    User.createOrder(req)
        .then(result => {
            res.redirect('/orders');
        })
        .catch();
}

module.exports.deleteCartProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.deleteCartProduct(productId, req.user)
    .then(() => {
        res.redirect('/cart');
    })
    .catch((err) => {
        console.error('Failed to delete cart');
    })
}
// module.exports.getCheckout = (req, res, next) => {
//     res.render('shop/checkout', {
//         pageTitle: 'Checkout',
//         path: '/checkout'
//     });
// }
module.exports.getOrders = (req, res, next) => {
    User.getOrders(req)
        .then(orders => {
            console.log('ShopOrders', orders);
            res.render('shop/orders', {
                pageTitle: 'Orders',
                path: '/orders',
                orders: orders
            });
        })
}
module.exports.getIndex = (req, res, next) => {
    Product.fetchAll().then((products) => {
        console.log('products', products)
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    }).catch();
}
