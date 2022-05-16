var express = require('express');
const axios = require('axios');
require('dotenv/config')
const User = require("../ models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//User Registration
router.post("/register", async (req, res) => {

  const isExisting = await User.findOne({ email: req.body.email });

  if (isExisting) {
    res.json({ status: 401, message: "user already exist" });
  } else {

    //cart creation -----------------------------------------------------------------
    //creating a new cart for the user
    var cartId = null;

    let full_name = req.body.full_name;
    let email = req.body.email;
    let mobile_number = req.body.mobile_number;
    let delivery_address = req.body.delivery_address;
    let password = req.body.password;

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    const user = await new User({
      fullName: full_name,
      email: email,
      mobileNumber: mobile_number,
      deliveryAddress: delivery_address,
      password: hash,
      cart : cartId
    });

    user.save().then(data => {
      console.log(data.id)
      axios.get(process.env.nethsara + "/create/" + data.id)
          .then(res => {
            console.log("cart created")
          }).catch(err => {
        res.status(500).json({message : 'error'})
      })

      res.json({ status: 201, message: "user registered" });
    });
  }
});



//User Login
router.post("/login", async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    console.log(email,password)

    const user = await User.findOne({ email: email })

    console.log(user)

    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        const accessToken = jwt.sign(
            { user },
            process.env.ACCESS_TOKEN_SECRET_KEY,
            {
              expiresIn: "1h",
            }
        );
        res.json({ status: 200, token: accessToken, user: user });
      } else {
        res.json({ status: 401, message: "unauthorized" });
      }
    } else {
      res.json({ status: 404, message: "user does not exist." });
    }
  } catch (err) {
    res.json({ error: err });
  }
});


//View User Profile
router.get("/:id", async (req, res) => {
  try {

    let userID = req.params.id;
    const user = await User.findOne({ _id:userID });

    if (user) {
      //const orders = await Order.find({"user": userID}).populate('items');
      res.json({ status: 200, user: user, orders: orders});
    } else {
      res.json({ status: 404, message: "user does not exist." });
    }
  } catch (err) {
    res.json({ error: err });
  }
});


//Update User Profile
router.put("/update/:id", async (req, res) => {

  try{
    const userID = req.params.id;
    let updateUser;

    let full_name = req.body.full_name;
    let email = req.body.email;
    let mobile_number = req.body.mobile_number;
    let delivery_address = req.body.delivery_address;

    updateUser = {
      fullName: full_name,
      email: email,
      mobileNumber: mobile_number,
      deliveryAddress: delivery_address,
    };

    await User.findByIdAndUpdate(userID, updateUser).then((user) => {
      res.json({ status: 200, message: "user updated", user: user });
    });

  }

  catch(e){
    res.json({ status: 200, error: e });
  }

});

//update password
router.put("/update_password/:id", async (req, res) => {

  try{

    const userID = req.params.id;
    let updateUser;

    let user = await User.findOne({_id: userID});
    const auth = await bcrypt.compare(req.body.old_password, user.password);

    if(auth){
      let password = req.body.new_password;

      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);

      updateUser = {
        password: hash,
      };
    }
    else{
      res.json({ status: 401, error: "Password does not match" });
    }

    await User.findByIdAndUpdate(userID, updateUser).then((user) => {
      res.json({ status: 200, message: "password updated", user: user });
    });
  }
  catch(e){
    res.json({ status: 200, error: e });
  }

});

router.post('/addWishItem', async (req,res,_next) =>{
  var userId = req.body.userId;
  var itemId = req.body.itemId;

  User.findOneAndUpdate({_id:userId}, {$push:{wishList: itemId}}, (err,data)=>{
    if(!err){
      res.status(200).json("success")
    }else{
      res.status(500).json(err)
    }
  })
})

router.post('/remWishItem', async (req,res,_next) =>{
  var userId = req.body.userId;
  var itemId = req.body.itemId;

  User.findOneAndUpdate({_id:userId}, {$pop:{wishList: itemId}}, (err,data)=>{
    if(!err){
      res.status(200).json("success")
    }else{
      res.status(500).json(err)
    }
  })
})
//
// //get all the coupend owned by the user
// router.get('/allWishItems/:id',async (req,res,_next) =>{
//   var userId = req.params.id;
//
//   var allC = await User.findOne({_id:userId}).populate('wishList')
//
//   res.status(200).json(allC)
// })




module.exports = router;

