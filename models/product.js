const getDb = require('../util/database').getDb;
const mongoDb = require('mongodb');

class Product {
    constructor(title, price, description, imageUrl, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.userId = userId;
    }

    addProduct() {
        return getDb().collection('products').insertOne(this)
            .then((result) => {
                console.log('product added', result)
            }).catch(() => {
                console.log('Error while adding product');
            })
    }
    static fetchAll() {
        return getDb()
        .collection('products')
        .find()
        .toArray()
    }
    static getProductById(productId) {
        return getDb()
            .collection('products')
            .find({ _id: new mongoDb.ObjectId(productId) })
            .next()
    }
    static updateProduct(productId, productData) {
        return getDb()
        .collection('products')
        .updateOne({_id: new mongoDb.ObjectId(productId)}, {$set: productData})
    }
    static deleteProductById(productId) {
        return getDb()
        .collection('products')
        .deleteOne({_id: new mongoDb.ObjectId(productId)})
    }
    static getCartProducts(user) {
        const productIds = user.cart.items.map((item) => {
            return  new mongoDb.ObjectId(item.productId);
        });
        console.log('productIds', productIds)
        return getDb()
        .collection('products')
        .find({_id: { $in: productIds } })
        .toArray()
        .then((products) => {
            console.log('products', products)
            return products.map((p) => {
                return {
                    ...p,
                    quantity: user.cart.items.find((item) => {
                        return p._id == item.productId
                    }).quantity
                }
            })
        })
    }

    static deleteCartProduct(productId, user) {
        const updatedCart = {
            items: user.cart.items.filter((item) => {
                return item.productId != productId
            })
        };
        console.log('updatedCart', updatedCart);
        user.cart = updatedCart;
        return getDb()
        .collection('users')
        .updateOne({_id: new mongoDb.ObjectId(user._id)}, {$set: {
            cart: updatedCart
        }})
    }
}

module.exports = Product;