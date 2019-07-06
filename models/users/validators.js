const mongoose = require('mongoose');

const validateEmail = {
    validator: function (value) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
    },
    message: 'Email is invalid'
}

const verifyBook = {
    validator: function (_id) {
        return new Promise(function (resolve, reject) {
            mongoose.model('Book').countDocuments({ _id }, function (err, number) {
                if (err)
                    throw new Error(err);

                return resolve(number === 1);
            });
        });
    },
    message: 'Book Not found'
}

module.exports = {
    validateEmail,
    verifyBook
}