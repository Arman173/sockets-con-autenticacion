const { Socket } = require("socket.io");
const { checkJWT } = require('../helpers');
const { ChatMessages } = require('../models');

const chatMessages = new ChatMessages();


const socketController = async( socket = new Socket(), io ) => {
    // console.log( 'Cliente connectado', socket.id );
    // console.log( socket.handshake.headers['x-token'] );
    const user = await checkJWT( socket.handshake.headers['x-token'] );

    if ( !user ) return socket.disconnect();

    // agregar al usuario conectado
    chatMessages.connectUser( user );
    console.log( '\n', user.name, 'connected' );
    io.emit('users-active', chatMessages.usersArr);
    socket.emit('receive-messages', chatMessages.latest);


    // Conectarlo a una sala especial
    socket.join( user.id ); // los usuarios tienen tres salas, global, socket.id, user.id


    // eliminar al usuario conectado
    socket.on('disconnect', () => {
        chatMessages.disconnectUser( user.id );
        console.log( '\n', user.name, 'diconnected' );
        io.emit('users-active', chatMessages.usersArr);
    });


    socket.on('send-message', ({ uid, message }) => {

        if ( uid ) {
            // mensaje privado
            socket.to( uid ).emit('private-message', { from: user.name, message });
        } else {
            // mensaje publico
            chatMessages.sendMessage( user.id, user.name, message );
            io.emit('receive-messages', chatMessages.latest);
        }

    });

}


module.exports = {
    socketController
}