var express = require('express');
var Coupon = require('../ models/coupenModel')
var User = require('../ models/userModel')
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
    var allCoupons = await Coupon.find()

    res.status(200).json(allCoupons)
});

//create new coupen
router.post('/new', async (req,res,_next) =>{
    var name = req.body.name;
    var code = req.body.code;
    var value = req.body.value;
    var expireDate = req.body.expireDate;

    const newC = new Coupon({
        name:name,
        code:code,
        value:value,
        expireDate:expireDate
    })

    newC.save().then(data =>{
        console.log(data)
    }).catch(err =>{
        res.status(500).json(err)
    })
})

//attach a coupon code to a user

router.post('/attach', async (req,res,_next) =>{
    var userId = req.body.userId;
    var coupId = req.body.coupId;
    User.findOneAndUpdate({_id: userId},{$push:{coupons: coupId}}, (err, data) =>{
        if(!err){
            res.status(200).json("success")
        }
    })
})

//delete a coupen from a egisterd user
router.post('/detach', async (req,res,_next) =>{
    var userId = req.body.userId;
    var coupId = req.body.coupId;

    User.findOneAndUpdate({_id:userId}, {$pop:{coupons: coupId}}, (err,data)=>{
        if(!err){
            res.status(200).json("success")
        }
    })
})

//get all the coupend owned by the user
router.get('/allC/:id',async (req,res,_next) =>{
    var userId = req.params.id;

    var allC = await User.findOne({_id:userId}).populate('coupons')

    res.status(200).json(allC)
})

module.exports = router;
