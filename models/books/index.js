const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.Types.ObjectId,
    { asyncIdGenerator } = require('../utilities'),
    { verifyOwner } = require('./validators'),
    { lockedFields } = require('../utilities');

let BookSchema = new Schema({
    id: {
        type: String
    },
    title: {
        type: String,
        trim: true,
        maxlength: [255, 'Book title length must be at most 255 character long'],
        required: [true, 'Book title required']
    },
    author: {
        type: String,
        trim: true,
        maxlength: [255, 'Book author length must be at most 255 character long'],
        required: [true, 'Book author required']
    },
    owner: {
        type: ObjectId,
        ref: 'User',
        required: [true, 'Book Owner is required'],
        validate: verifyOwner
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret, options) {
            delete ret._id;
            delete ret.owner;
            delete ret.updatedAt;
            delete ret.__v;
            return ret;
        }
    }
});

BookSchema.pre('save', async function (next) {
    try {
        if (this.isNew){
            this.id = await asyncIdGenerator.generateUniqueId(this, 'b', 9);
            this.BookCreated = true;
        }

        await lockedFields(this, ['id', 'owner', 'title', 'author']);
        return next();
    } catch (err) {
        return next(err);
    }
});

BookSchema.post('save', async function (doc, next) {
    try {
        if (this.BookCreated) {
            let user = await mongoose.model('User').findOne({'_id': doc.owner});
            user.books.push(doc._id);
            await user.save();
        }

        return next();
    } catch (err) {
        return next(err);
    }
});

BookSchema.post('deleteOne', { document: true, query: false }, async function (doc, next) {
    try {
        //Cascaded Delete
        let user = await mongoose.model('User').findOne({ '_id': doc.owner });
        user.books = user.books.filter((book) => book.toString() != doc._id.toString());
        await user.save();

        return next();
    } catch (err) {
        return next(err);
    }
});

BookSchema.pre('update', function() {
    //error
});

module.exports = mongoose.model('Book', BookSchema, 'books');