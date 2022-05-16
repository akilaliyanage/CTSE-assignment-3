const mongoose = require('mongoose');
const {Mongoose} = require("mongoose");
const  Schema = mongoose.Schema;

const couponSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    code:{
        type: String,
        required: true
    },
    value:{
        type: String,
        required: true
    },
    expireDate:{
        type: String,
        required: true
    }
})
const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;