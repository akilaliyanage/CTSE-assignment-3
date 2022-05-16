const mongoose = require('mongoose');
const {Mongoose} = require("mongoose");
const  Schema = mongoose.Schema;

const userSchema = new Schema({

    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    NIC: {
        type: String,
        required: false
    },
    mobileNumber: {
        type: Number,
        required: false
    },
    deliveryAddress: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: false
    },
    coupons:[
        {type : Schema.Types.ObjectId, ref : 'Coupon'}
    ]
})
const User = mongoose.model("User", userSchema);
module.exports = User;