const mongoose = require('mongoose');

const verifyUser = {
    validator: function (_id) {
        return new Promise(function (resolve, reject) {
            mongoose.model('User').countDocuments({ _id }, function (err, number) {
                if (err)
                    throw new Error(err);

                return resolve(number === 1);
            });
        });
    },
    message: 'User Not found'
}

module.exports = {
    verifyUser
}