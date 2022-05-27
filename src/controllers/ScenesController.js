const express = require('express');
const ScenesController = express.Router();
const { BadRequestException } = require('../service/ErrorService');
const { Scene } = require('../models/Scenes');

ScenesController.get('/', async function(req, res) {
    const scenes = await Scene.find({ active: true });
    res.send(scenes);
});

ScenesController.post('/', async function(req, res) {
    const errors = [];

    if(!req.body.title){
        errors.push('title is required');
    }

    if(errors.length > 0){
        res.status(400).send(new BadRequestException(errors));
        return;
    }

    const scene = new Scene(req.body);
    await scene.save();

    res.status(201).send(scene);
});

ScenesController.put('/', async function(req, res) {

    if(!req.body.id){
        res.status(400).send(new BadRequestException('id is required'));
    }

    const sceneFinded = await Scene.findById(req.body.id);

    if(!sceneFinded){
        res.status(400).send(new BadRequestException('scene not found'));
        return;
    }

    delete req.body.id;
    await Scene.updateOne({id: req.body.id,}, req.body);
    

    const scene = await Scene.findOne({ id: req.body.id });
    res.status(200).send(scene);
});


module.exports = ScenesController;
