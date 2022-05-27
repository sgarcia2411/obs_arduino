require('dotenv').config();

require('colors');
const OBSWebSocket = require('obs-websocket-js');
const { SerialPort } = require('serialport')
const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const serialport = new SerialPort({ path: process.env.ARDUINO_PATH, baudRate: parseInt(process.env.ARDUINO_BAUD_RATE) })
const scenesController = require('./controllers/ScenesController.js');
const ordersArduinoController = require('./controllers/OrdersArduinoController.js');

const { Scene } = require('./models/Scenes');
const { OrderArduino } = require('./models/OrdersArduino');

const obs = new OBSWebSocket();
obs.connect({
        address: `${process.env.OBS_HOST}:${process.env.OBS_PORT}`,
        password: process.env.OBS_PASSWORD
    })
    .then(async () => {
        console.log(`Success! We're connected & authenticated.`.green);

        const data = await obs.send('GetSceneList');
        console.log(`${data.scenes.length} Available Scenes!`);
        data.scenes.forEach(scene => {
            console.log(scene.name);
        });
    })
    .catch(() => {
        console.error('error connect to server. Service Stopped'.red);
    });

obs.on('SwitchScenes', async data => {
    console.log(`New Active Scene: ${data.sceneName}`);
    try {
        const scene = await Scene.find({ title: data.sceneName, active: true });
        console.log(scene);
        if(scene.length > 0) {
            const orders = await OrderArduino.find({ scene_id: scene[0]._id, active: true });
            orders.forEach(order => {
                serialport.write(order.order);
            });
        }
    } catch (error) {
        console.log(error);
    }
    
});

/*obs.on('ScenesChanged', data => {
    console.log(`SceneNameChanged: ${JSON.stringify(data)}`);
});*/

// You must add this handler to avoid uncaught exceptions.
obs.on('error', err => {
    console.error('socket error:', err);
});

// express
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));


app.get('/', function (req, res) {
    res.send({'OBS_ARDUINO': 'ON'})
})

app.use('/scenes', scenesController);
app.use('/orders-arduino', ordersArduinoController);

// handler error
app.use((err, req, res, next) => {
    console.log('handler error');
    res.header("Content-Type", 'application/json');
    res.status(err.status).send(err.message)
});

// handler not found
app.use(function(req,res){
    res.status(404).send({ error: 'Not Found' });
});

const expressPort = process.env.EXPRESS_PORT || 4000
  
const server = app.listen(expressPort, async function (){
    var host = server.address().address;
    var port = server.address().port;
    await mongoose.connect('mongodb://localhost:27017/obs_arduino');
    console.log('App listening at http://%s:%s'.blue, host, port);
});
  