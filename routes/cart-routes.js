//import the express router
const router = require('express').Router();
//call the database model for products
const Cart = require('../models/cart-model');
const { Mongoose } = require('mongoose');

router.get('/', async (req, res) => {
    await Cart.find()
        .then((result) => {
            res.json(result)
        })
        .catch((err) => {
            console.log(err)
        })
})

router.get('/sd/:id', (req, res) => {
    const id = req.params.id;
    Cart.findById(id)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.status(404).render('404', { title: '404' }); //renders the 404 page if product with id does not exist
        });
});

//should there not be a forwardslash before sd?
router.post('sd/', async (req, res) => {
    let saveCart = Cart(req.body)
    try {
        const savedProduct = await saveCart.save();
        res.status(200).json(savedProduct);
    } catch {
        res.status(500).json(err);
    }
})

router.put('/sd/:id', async (req, res) => {
    const id = req.params.id;
    const product = await Cart.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update products with id ${id}`
                });
            } else res.send({ message: "Product was updated sucessfully" });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating product with id" + id
            })
        })
})

router.delete('/dsd/:id', async (req, res) => {
    const id = req.params.id;

    await Cart.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/shop/products' }, result);
        })
        .catch(err => {
            console.log(err);
        })
});

module.exports = router;