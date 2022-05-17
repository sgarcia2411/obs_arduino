const OBSWebSocket = require('obs-websocket-js');
const { SerialPort } = require('serialport')
const serialport = new SerialPort({ path: '/dev/cu.usbmodem1201', baudRate: 9600 })

const obs = new OBSWebSocket();
obs.connect({
        address: 'localhost:4444',
        password: '123456'
    })
    .then(() => {
        console.log(`Success! We're connected & authenticated.`);

        return obs.send('GetSceneList');
    })
    .then(data => {
        console.log(`${data.scenes.length} Available Scenes!`);
    })
    .catch(err => { // Promise convention dicates you have a catch on every chain.
        console.log(err);
    });

obs.on('SwitchScenes', data => {
    console.log(`New Active Scene: ${data.sceneName}`);
    try {
        if(data.sceneName === "Plataforma"){
            serialport.write('4')
        } else {
            serialport.write('5')
        }
    } catch (error) {
        console.log(error);
    }
    
});

// You must add this handler to avoid uncaught exceptions.
obs.on('error', err => {
    console.error('socket error:', err);
});