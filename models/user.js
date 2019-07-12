
const mongoDb = require('mongodb');
const getDb = require('../util/database').getDb;
const Product = require('./product');

class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    addUser() {
        return getDb()
        .collection('users')
        .insertOne(this)
        .toArray();
    }

    static getUserById(userId) {
        return getDb()
        .collection('users')
        .find({_id: new mongoDb.ObjectId(userId)})
        .next();
    }

    static getUserByEmail(email) {
        return getDb()
        .collection('users')
        .find({email: email})
        .next();
    }
    static addToCart(cart, userId) {
        return getDb()
        .collection('users')
        .updateOne({_id: new mongoDb.ObjectId(userId)}, {$set: {
            cart: cart
        }})
    }
    static createOrder(req) {
        return Product.getCartProducts(req.user).then((products) => {
            const order = {
                items: products,
                user: {
                    _id: new mongoDb.ObjectId(req.user._id),
                    name: req.user.name
                }
            }
            return getDb()
                .collection('orders')
                .insertOne(order)
                .then(result => {
                    req.user.cart = {
                        items: []
                    }
                    return getDb()
                        .collection('users')
                        .updateOne({ _id: new mongoDb.ObjectId(req.user._id) }, {
                            $set: {
                                cart: {
                                    items: []
                                }
                            }
                        })
                });
        })
    }
    static getOrders(req) {
        return getDb()
            .collection('orders')
            .find({'user._id': new mongoDb.ObjectId(req.user._id)})
            .toArray()
    }
}

module.exports = User;