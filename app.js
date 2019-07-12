const express = require('express');
const path = require('path');
const mangoConnect = require('./util/database').mangoConnect;

const bodyParser = require('body-parser');

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const errorController = require('./controller/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    User.getUserByEmail('vivek@test.com')
    .then((user) => {
        if (user) {
            req.user = user;
        }
        next();
    });
})

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(errorController.get404);

// Database stuff
mangoConnect().then(client => {
    //console.log('client', client);
    const newUser = new User('Vivek', 'vivek@test.com');
    User.getUserByEmail('vivek@test.com')
        .then((user) => {
            if (!user) {
                newUser.addUser()
                    .then(() => {
                        console.log('User Added successfully');
                    })
                    .catch(() => {
                        console.log('User adding failed');
                    })
            } else {
                console.log('User details', user);
            }
        })
        .catch(() => {
            console.log('Could not find user')
        })
    app.listen(3000);
}).catch(() => {
    console.log('Failed to connect mongo DB')
});
