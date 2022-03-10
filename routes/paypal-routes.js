//Import of the express and Paypal-rest-sdk Modules
const router = require('express').Router();

//imports the paypal rest SDK
const paypal = require('paypal-rest-sdk');

//call the database model for products
const Product = require('../models/product-model');
const Cart = require('../models/cart-model');
const Order = require('../models/order');


/***********************************************************/


//make sure this isnt hard-coded
// The payment details that Paypal uses to initiate a transaction.
router.post('/pay', (req, res) => {


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
                "currency": "USD",
                "quantity": cart.totalQty
            }]
        },
        "amount": {
            "currency": "USD",
            "total": cart.totalPrice   
        },
          "description": "Washing Bar soap"
      }]
  }
  



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



} catch(error) {
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
              "currency": "USD",
              "total": cart.totalPrice
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
       
          // save order item
          const order = new Order({
            user: req.user,
            cart: cart,
            name:req.body.username


            
          });
          
          // Empties the shopping cart after sucessful payment
          req.session.cart = null;
          res.render('payment-success');
      }
      
  });
  });

/***********************************************************/

// Export of the paypal-routes Module
module.exports = router;