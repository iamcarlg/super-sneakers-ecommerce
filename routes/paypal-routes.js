//Import of the express and Paypal-rest-sdk Modules
const router = require('express').Router();

//imports the paypal rest SDK
const paypal = require('paypal-rest-sdk');

//call the database model for products
const Product = require('../models/product-model');
const Cart = require('../models/cart-model');


/***********************************************************/


//make sure this isnt hard-coded
// The payment details that Paypal uses to initiate a transaction.
router.post('/pay', (req, res) => {

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
                  "name": "Redhock Bar Soap",
                  "sku": "001",
                  "price": Product.price,
                  "currency": "SEK",
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": "SEK",
              "total": Product.price //change this later?
          },
          "description": "Washing Bar soap"
      }]
  };
  
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        for(let i = 0;i < payment.links.length;i++){
          if(payment.links[i].rel === 'approval_url'){
            res.redirect(payment.links[i].href);
          }
        }
    }
  });
  
  });

/***********************************************************/

//make sure its not hard-coded
// In case the operation is successful
  router.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
  
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": "SEK",
              "total": Product.price
          }
      }]
    };

    // If the user cancels the operation, the page sends 'Cancelled'
    router.get('/cancel', (req, res) => res.send('Cancelled'));
  
  // Obtains the transaction details from paypal
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        //When error occurs when due to non-existent transaction, throw an error else log the transaction details in the console then send a Success string response to the user.
      if (error) {
          console.log(error.response);
          throw error;
      } else {
          console.log(JSON.stringify(payment));
          res.render('payment-success');
      }
  });
  });

/***********************************************************/

// Export of the paypal-routes Module
module.exports = router;