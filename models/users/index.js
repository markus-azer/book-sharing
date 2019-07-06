const mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.Types.ObjectId,
    ValidationError = require('mongoose').Error.ValidationError,
    ValidatorError = require('mongoose').Error.ValidatorError,
    { asyncIdGenerator } = require('../utilities'),
    { validateEmail, verifyBook } = require('./validators');

let UserSchema = new Schema({
    id: {
        type: String
    },
    fullName: {
        type: String
    },
    firstName: {
        type: String,
        trim: true,
        minlength: [3, 'First Name length must be at least 3 character long'],
        maxlength: [255, 'First Name length must be at most 255 character long'],
        required: [true, 'First Name required']
    },
    lastName: {
        type: String,
        trim: true,
        minlength: [3, 'Last Name length must be at least 3 character long'],
        maxlength: [255, 'Last Name length must be at most 255 character long'],
        required: [true, 'Last Name required']
    },
    email: {
        type: String,
        lowercase: true,
        minlength: [6, 'Email length must be at least 6 character long'],
        maxlength: [255, 'email length must be at most 255 character long'],
        required: [true, 'Email required'],
        validate: validateEmail
    },
    mobile:{
        type: Number
    },
    password: {
        type: String,
        minlength: [6, 'Password length must be at least 6 character long'],
        maxlength: [255, 'Password length must be at most 255 character long'],
        required: [true, 'Password required']
    },
    spaces: [{type: ObjectId, ref:'Space'}],
    books: [{type: ObjectId, ref:'Book', validate: verifyBook}],

}, {
    timestamps: true
});

UserSchema.static('validatePassword', function (password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
});

UserSchema.pre('save', async function (next) {
    try {
        if (this.isNew)
            this.id = await asyncIdGenerator.generateUniqueId(this, 'u', 9);

        if(this.isModified('firstName') || this.isModified('lastName'))
            this.fullName = `${this.firstName} ${this.lastName}`;

        if(this.isNew || this.isModified('email')){
            const email = new RegExp(this.email, 'i');
            const count = await mongoose.model('User').countDocuments({ email });

            if(count !== 0){
                let error = new ValidationError(this);
                error.errors['email'] = new ValidatorError({
                    'message': `Email is already registered`,
                    'type': 'duplication',
                    'path': 'email',
                    'value': this.email
                });
                throw error;
            }
        }

        if (this.isModified('password')){
            const salt = bcrypt.genSaltSync(10);
            this.password = bcrypt.hashSync(JSON.parse(JSON.stringify(this.password)), salt);
        }

        return next();
    } catch (err) {
        return next(err);
    }
});

module.exports = mongoose.model('User', UserSchema, 'users');