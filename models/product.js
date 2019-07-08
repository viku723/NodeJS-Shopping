const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const productsFilePath = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

const getProductsFromFile = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(path.dirname(process.mainModule.filename), 'data', 'products.json'), (err, fileContent) => {
            const products = [];
            if (err) {
                resolve(products);
            } else {
                resolve(JSON.parse(fileContent));
            }
        });
    });
}

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }
    save() {
        getProductsFromFile().then((products) => {
            if (this.id) {
               const editProductIndex = products.findIndex((p) => p.id == this.id);
                let editProducts = [...products];
                editProducts[editProductIndex] = this;
                fs.writeFile(productsFilePath, JSON.stringify(editProducts), (err) => {
                    console.log('Error writing file', err);
                });
            } else {
                this.id = Math.random();
                products.push(this);
                fs.writeFile(productsFilePath, JSON.stringify(products), (err) => {
                    console.log('Error writing file', err);
                });
            }
        })
    }
    static deleteProduct(productId) {
        getProductsFromFile().then((products) => {
            const deleteProductIndex = products.findIndex((p) => p.id == productId);
            const productPrice = products[deleteProductIndex].price;
            let updatedProducts = [...products];
            updatedProducts.splice(deleteProductIndex, 1);
            fs.writeFile(productsFilePath, JSON.stringify(updatedProducts), (err) => {
                if (!err) {
                    Cart.deleteCartProduct(productId, productPrice);
                }
                console.log('Error while deleting product writing file', err);
            });
        });
    }
    static fetchAllProducts() {
        return getProductsFromFile();
    }
    static getProductById(productId) {
        return new Promise((resolve, reject) => {
            getProductsFromFile().then((products) => {
                const product = products.find((p) => p.id == productId);
                if (productId != null) {
                    resolve(product);
                } else {
                    reject();
                }
            })
        })
    }
}