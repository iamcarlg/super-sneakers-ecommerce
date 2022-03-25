//Import of the express and Paypal-rest-sdk Modules
const router = require('express').Router();

//imports the paypal rest SDK
const paypal = require('paypal-rest-sdk');

//call the database models
const Product = require('../models/product-model');
const Order = require('../models/order-model');
//call the cart configurations
const Cart = require('../config/cart-config');

// middleware that allows us to send mails after successful order
const nodemailer = require("nodemailer");

//call on secret keys form the configs
const keys = require('../config/keys');

const visited = [];
const user_mail = [];
const base_url = "https://supersneakers.herokuapp.com" || "http://localhost:3000"
/***********************************************************/

//Directs us to shipping information form
router.get('/shippinginformation', (req, res) => {
  try {
    res.render('order-form', { title: 'Shipping Information', user: req.user })
  } catch (err) {
    res.redirect('/'); //is this the best redirect path?
    console.log("Could not find shipping information page", err);
  }
});



//make sure this isnt hard-coded
// The payment details that Paypal uses to initiate a transaction.
router.post('/checkout', (req, res) => {

  try {
    if (!req.session.cart) {
      return res.redirect('/cart')
    }
  } catch (err) {
    res.redirect('/'); //is this the best redirect path?
    console.log("Could not find checkout page", err);
  }


  const cart = new Cart(req.session.cart);

  try {
    const create_payment_json = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": base_url + "/paypal/success",
        "cancel_url": base_url + "/paypal/cancel"
      },
      "transactions": [{
        "item_list": {
          "items": [{
            "name": "",
            "sku": "item",
            "price": 0,
            "currency": "SEK",
            "quantity": cart.totalQty
          }]
        },
        "amount": {
          "currency": "SEK",
          "total": cart.totalPrice
        },
        "description": ""
      }]
    }


    // Save the shipping information to orderdatabase
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      zipcode: req.body.zipcode,
      email: req.body.email,
      name: req.body.name,
    });


    order.save(function (err, result) {
      if (err) {
        console.log(err)

      }
    })

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        user_mail.length = 0;
        visited.length = 0;
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            user_mail.push(order.email);
            visited.push(order);
            res.redirect(payment.links[i].href);
          }
        }
      }
    });



  } catch (error) {
    user_mail.length = 0;
    visited.length = 0;
    console.log(error)
  }
});

/***********************************************************/

//make sure its not hard-coded
// In case the operation is successful
router.get('/success', (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  if (!req.session.cart) {
    user_mail.length = 0;
    visited.length = 0;
    return res.redirect('/cart')
    
  }

  const cart = new Cart(req.session.cart);

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
      "amount": {
        "currency": "SEK",
        "total": cart.totalPrice
      }
    }]
  };

  // Obtains the transaction details from paypal
  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    //When error occurs when due to non-existent transaction, throw an error else log the transaction details in the console then send a Success string response to the user.
    if (error) {
      visited.push(order);
      console.log(error.response);
      throw error;
    } else {
      console.log(JSON.stringify(payment));

      // Empties the shopping cart after sucessful payment
      let cart = new Cart(req.session.cart);

      // save order item
      const order = new Order({
        user: req.user,
        cart: cart,
        name: req.body.username

      });

      // Generating a random order ID
      const val = Math.floor(1000 + Math.random() * 9000);
      console.log(val);

      req.session.cart = null;
      res.render('payment-success', {
        title: 'Order confirmation details',
        visited : visited,
        orderID : val,
        products: order.cart.generateArray(),
        totalPrice: order.cart.totalPrice,
        totalQty: order.cart.totalQty,
        user: req.user
      });

      visited.length = 0;

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: keys.nodemailer.user,
          pass: keys.nodemailer.pass
        }
      });



      console.log(user_mail);

      const mailConfigurations = {

        // It should be a string of sender email
        from: 'supersneakersbrand@gmail.com',
        // Comma Separated list of mails
        to: user_mail, //change to session based login
        // Subject of Email
        subject: 'Thanks for your order',
        // This would be the text of email body
        text: 'Dear customer, \n\nWe are grateful that you\'ve chosen us to enhance your sneaker game. \nYour order is being processed. \nPlease note that we deliver between monday to friday, which are our couriers\' working days. \nNo need to camp out by the mailbox waiting for the postman.\n\nYours Sincerely,\Mar,\nCustomer Support',
        
      };

      transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) throw Error(error);
        console.log('Email Sent Successfully');
        console.log(info);
      });
    }
  });
});

/***********************************************************/

// If the user cancels the operation, the page sends 'Cancelled'
router.get('/cancel', (req, res) =>{

  user_mail.length = 0;
  visited.length = 0;
  res.redirect('/');

})      

  

/***********************************************************/

// Export of the paypal-routes Module
module.exports = router;