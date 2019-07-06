const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.Types.ObjectId,
    { asyncIdGenerator } = require('../utilities'),
    { verifyUser } = require('./validators');

let SpaceSchema = new Schema({
    id: {
        type: String
    },
    name: {
        type: String,
        trim: true,
        minlength: [3, 'Space Name length must be at least 3 character long'],
        maxlength: [255, 'Space Name length must be at most 255 character long'],
        required: [true, 'Space Name required']
    },
    owner: {
        type: ObjectId,
        ref: 'User',
        required: [true, 'Space Owner is required'],
        validate: verifyUser
    },
    //TODO: Add validator for array lenght
    members: [{type: ObjectId, ref: 'User', validate: verifyUser}]
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret, options) {
            delete ret._id;
            delete ret.owner;
            delete ret.members;
            delete ret.updatedAt;
            delete ret.__v;
            return ret;
        }
    }
});

SpaceSchema.pre('save', async function (next) {
    try {
        if (this.isNew){
            this.id = await asyncIdGenerator.generateUniqueId(this, 's', 9);
            this.spaceCreated = true;
        }

        return next();
    } catch (err) {
        return next(err);
    }
});

SpaceSchema.post('save', async function (doc, next) {
    try {
        if (this.spaceCreated){
            let user = await mongoose.model('User').findOne({'_id': doc.owner});
            user.spaces.push(this._id);
            await user.save();
        }
        return next();
    } catch (err) {
        return next(err);
    }
});

module.exports = mongoose.model('Space', SpaceSchema, 'spaces');