const fs = require('fs');
const path = require('path');

const cartFilePath = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

module.exports =  class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(cartFilePath, (err, fileContent) => {
            let cart = { products:[], totalPrice: 0 }
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            const existingCartProductIndex = cart.products.findIndex((product) => product.id == id);
            const existingCartProduct = cart.products[existingCartProductIndex];
            let updatedCartProduct;
            if (existingCartProduct) {
                updatedCartProduct = { ...existingCartProduct };
                updatedCartProduct.qty = existingCartProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingCartProductIndex] = updatedCartProduct;
            } else {
                updatedCartProduct = { id: id, qty: 1 }
                cart.products = [...cart.products, updatedCartProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(cartFilePath, JSON.stringify(cart), (err) => {
                console.log(err);
            })
        })
    }
    static deleteCartProduct(productId, productPrice) {
        fs.readFile(cartFilePath, (err, fileContent) => {
           let cart = {...JSON.parse(fileContent)};
            const deleteCartProduct = cart.products.filter((p) => {
                return p.id == productId;
            })[0];
            if (!deleteCartProduct) {
                return;
            }
            cart.products = cart.products.filter((p) => {
                return p.id !== productId;
            });
            cart.totalPrice = cart.totalPrice - deleteCartProduct.qty * productPrice;
            fs.writeFile(cartFilePath, JSON.stringify(cart), (err) => {
                console.log(err);
            })
        })
    }
    static getCart() {
        return new Promise((resolve, reject) => {
            fs.readFile(cartFilePath, (err, fileContent) => {
                if (!err) {
                    resolve(JSON.parse(fileContent));
                } else {
                    reject(null);
                }
            })
        })
    }
}