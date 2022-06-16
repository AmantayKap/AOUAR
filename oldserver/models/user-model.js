const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true, min: 3, max: 20
    },
    email: {
        type:String,
        unique: true,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    isActivated: {
        type: Boolean,
        default: false
    },
    profilePicture: {
        type: String,
        default: "",
    },
    followers: {
        type: Array,
        default: [],
    },
    followings: {
        type: Array,
        default: [],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    desc: {
        type: String,
        max: 50,
    },
    city: {
        type: String,
        max: 50,
    },
    from: {
        type: String,
        max: 50,
    },
    relationship: {
        type: Number,
        enum: [1, 2, 3],
    },
  }, {timestamps: true}
);

module.exports = model('User', UserSchema);