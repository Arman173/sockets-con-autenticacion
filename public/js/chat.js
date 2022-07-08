// console.log( window.location.hostname.includes('localhost') );
const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8081/api/auth'
            : 'https://sockets-con-autenticacion.herokuapp.com/api/auth';

let user   = null;
let socket = null;



// Referencias HTML
const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir   = document.querySelector('#btnSalir');



// Validar el token del LocalStorage
const validateJWT = async() => {
    
    const token = localStorage.getItem('token') || '';
    
    if ( token.length <= 10 ) {
        window.location = 'index.html'
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch( url, {
        headers: { 'x-token': token }
    });

    const { user: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem( 'token', tokenDB );
    user = userDB;
    console.log( user, tokenDB );
    document.title = user.name;

    await connectSocket();

}

const connectSocket = async() => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Socket online');
    });

    socket.on('disconnect', () => {
        console.log('Socket offline');
    });

    socket.on('receive-messages', drawMessages );

    socket.on('users-active', drawUsers );

    socket.on('private-message', (payload) => {
        // TODO
        console.log( 'private:', payload );
    });

}

const drawUsers = ( users = [] ) => {

    let usersHTML = '';

    users.forEach( ({ name, uid }) => {
        usersHTML += `
            <li class="list-group-item">
                <p>
                    <h5 class="text-success"> ${ name } </h5>
                    <span class="fs-6 text-muted">${ uid }</span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = usersHTML;
}

const drawMessages = ( messages = [] ) => {

    let messagesHTML = '';

    messages.forEach( ({ name, message }) => {
        messagesHTML += `
            <li class="list-group-item">
                <p>
                    <span class="text-primary"> ${ name } </span>
                    <span>${ message }</span>
                </p>
            </li>
        `;
    });

    ulMensajes.innerHTML = messagesHTML;
}

txtMensaje.addEventListener('keyup', ({ keyCode}) => {
    
    const message = txtMensaje.value;
    const uid     = txtUid.value;

    if ( keyCode !== 13 ) return;

    if ( message.trim().length === 0 ) return;

    socket.emit('send-message', { uid, message });
    txtMensaje.value = '';

});


const main = async() => {

    // validar JTW
    await validateJWT();

}


main();

// const socket = io();
