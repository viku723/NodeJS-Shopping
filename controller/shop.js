const Product = require('../models/product');
const Cart = require('../models/cart');

module.exports.getProducts = (req, res, next) => {
    Product.fetchAllProducts().then(([rows, fieldData]) => {
        res.render('shop/product-list', {
            prods: rows,
            pageTitle: 'Shop',
            path: '/'
          });
    }).catch();
}
module.exports.getProduct = (req, res, next) => {
    Product.findByPk(req.params.productId).then((product) => {
        res.render('shop/product-details', {
            product,
            pageTitle: product.title,
            path: '/products'
        });
    });
}
module.exports.getCart = (req, res, next) => {
    req.user.getCart().then((cart) => {
        cart.getProducts().then((products) => {
            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/cart',
                cartProducts: products
            })
        })
    });
}
module.exports.postCart = (req, res, next) => {
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart().then((cart) => {
        fetchedCart = cart;
        return cart.getProducts({
            where: {
                id: req.body.productId
            }
        });
    }).then((products) => {
        let product;
        if (products.length > 0) {
            product = products[0];
        }
        if (product) {
            newQuantity = product.cartItem.quantity + 1;
            return product
        }
        return Product.findByPk(req.body.productId)
    }).then((product) => {
        return fetchedCart.addProduct(product, {
            through: {
                quantity: newQuantity
            }
        })
    }).then(() => {
        res.redirect('/cart');
    }).catch();
}

module.exports.createOrder = (req, res, next) => {
    let fetchedCart;
    req.user.getCart()
    .then(cart => {
        fetchedCart = cart;
        return cart.getProducts();
    })
    .then(products => {
        return req.user.createOrder()
        .then((order) => {
            return order.addProducts(products.map((product) => {
                product.orderItem = {
                    quantity: product.cartItem.quantity
                }
                return product;
            }));
        }).catch()
    })
    .then(result => {
        return fetchedCart.setProducts(null);
    })
    .then(result => {
        res.redirect('/orders');
    })
    .catch();
}

module.exports.deleteCartProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user.getCart()
        .then((cart) => {
            return cart.getProducts({
                where: {
                    id: productId
                }
            })
        }).then((products) => {
            return products[0].cartItem.destroy();
        }).then(() => {
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
    req.user.getOrders({ include: ['products'] })
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Orders',
                path: '/orders',
                orders: orders
            });
        })
}
module.exports.getIndex = (req, res, next) => {
    Product.findAll().then((products) => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    }).catch();
}
