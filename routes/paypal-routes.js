//Import of the express and Paypal-rest-sdk Modules
const router = require('express').Router();

//imports the paypal rest SDK
const paypal = require('paypal-rest-sdk');

//call the database models
const Product = require('../models/product-model');
const Cart = require('../models/cart-model');
const Order = require('../models/order-model');

// middleware that allows us to send mails after successful order
const nodemailer = require("nodemailer");

//call on secret keys form the configs
const keys = require('../config/keys');

/***********************************************************/


//make sure this isnt hard-coded
// The payment details that Paypal uses to initiate a transaction.
router.post('/checkout', (req, res) => {


  if (!req.session.cart) {
    return res.redirect('/cart')
  }

  const cart = new Cart(req.session.cart);

  try {
    const create_payment_json = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": "http://localhost:3000/paypal/success",
        "cancel_url": "http://localhost:3000/paypal/cancel"
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


    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            res.redirect(payment.links[i].href);
          }
        }
      }
    });



  } catch (error) {
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
      console.log(error.response);
      throw error;
    } else {
      console.log(JSON.stringify(payment));

      // Empties the shopping cart after sucessful payment
      let cart = new Cart(req.session.cart)

      // save order item
      const order = new Order({
        user: req.user,
        cart: cart,
        name: req.body.username

      });

      req.session.cart = null;
      res.render('payment-success', {
        title: 'Order confirmation details',
        products: order.cart.generateArray(),
        totalPrice: order.cart.totalPrice,
        totalQty: order.cart.totalQty
      });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: keys.nodemailer.user,
          pass: keys.nodemailer.pass
        }
      });

      const mailConfigurations = {

        // It should be a string of sender email
        from: 'supersneakersbrand@gmail.com',

        // Comma Separated list of mails
        to: 'rugerocarlgauss@gmail.com', //change to session based login

        // Subject of Email
        subject: 'Thanks for your order',

        // This would be the text of email body
        text: 'Hi, \n\nWe are pleased that you\'ve chosen us to enhance your outfit. \nYou order is being processed. \nPlease note that we deliver from Monday to Friday, which are our courier\' working days. \nNo need to camp put by the mailbox waiting for the postman.\n\nYours Sincerely,\nCarl\nCustomer Support'
      };

      transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) throw Error(error);
        console.log('Email Sent Successfully');
        console.log(info);
      });
    }
  });
});

// If the user cancels the operation, the page sends 'Cancelled'
router.get('/cancel', (req, res) => res.send('Cancelled'));

/***********************************************************/

// Export of the paypal-routes Module
module.exports = router;