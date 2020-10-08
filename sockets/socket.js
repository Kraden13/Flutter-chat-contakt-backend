const { checkJWT } = require('../helpers/jwt.js');
const { io } = require('../index.js');
const {userConnected, userDisconnected, saveMessage} = require('../controllers/socket');
const user = require('../models/user.js');

io.on('connection', client => {
    console.log('Cliente conectado');

    const [valid,uid] = checkJWT(client.handshake.headers['x-token'])
    if(!valid) {return client.disconnect();}

    userConnected(uid) ;

    client.join(uid);


    client.on('private-message', async (payload)=> {
        console.log(payload);
       await saveMessage(payload);
        io.to(payload.to).emit('private-message',payload);
    })

    client.on('disconnect', () => { 
        console.log('Cliente desconectado');
        userDisconnected(uid);
    });


    // client.on('mensaje',(payload) => {

    //  console.log('Mensaje: ',payload);
    //  io.emit('mensaje',{admin : 'Nuevo mensaje'});
    // })


}); 