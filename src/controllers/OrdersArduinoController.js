const express = require('express');
const OrdersArduinoController = express.Router();
const { BadRequestException } = require('../service/ErrorService');

const { OrderArduino } = require('../models/OrdersArduino');

OrdersArduinoController.get('/', async function(req, res) {
    const orders = await OrderArduino.find({ active: true });
    res.send(orders);
});

OrdersArduinoController.post('/', async function(req, res) {
    const errors = [];
    
    if(!req.body.scene_id){
        errors.push('scene_id is required');
    }

    if(!req.body.order){
        errors.push('order is required');
    }

    if(errors.length > 0){
        res.status(400).send(new BadRequestException(errors));
        return;
    }

    const order = new OrderArduino(req.body);
    await order.save();

    res.status(201).send(order);
});

OrdersArduinoController.put('/', async function(req, res) {

    if(!req.body.id){
        res.status(400).send(new BadRequestException('id is required'));
    }

    const orderFinded = await OrderArduino.findById(req.body.id);

    if(!orderFinded){
        res.status(400).send(new BadRequestException('order arduino not found'));
        return;
    }

    delete req.body.id;
    await OrderArduino.updateOne({id: req.body.id,}, req.body);
    

    const order = await OrderArduino.findOne({ id: req.body.id });
    res.status(200).send(order);
});


module.exports = OrdersArduinoController;
