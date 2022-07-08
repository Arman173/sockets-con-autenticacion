// Referencias al HTML
const myForm = document.querySelector('form');


// console.log( window.location.hostname.includes('localhost') );
const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8081/api/auth'
            : 'https://sockets-con-autenticacion.herokuapp.com/api/auth';
console.log(url);


myForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = {};
    
    for( let element of myForm.elements ) {
        if ( element.name.length > 0 ) {
            formData[element.name] = element.value;
        }
    }

    fetch( url + '/login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: { 'Content-Type': 'application/json' }
    })
    .then( resp => resp.json() )
    .then( ({ errors, msg, token }) => {
        if ( errors ) {
            return console.error( { errors } );
        }

        if ( msg !== 'Login ok' ) {
            return console.error( msg );
        }

        localStorage.setItem( 'token', token );
        console.log( 'Logged!' );
        window.location = 'chat.html';
    })
    .catch( err => {
        console.log( err );
    });

});            


function handleCredentialResponse(response) {

    // google token | ID_TOKEN
    // console.log( 'id_token', response.credential );

    const body = { id_token: response.credential };

    fetch( url + '/google' , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( body )
    })
        .then( resp => resp.json() )
        .then( ({ token }) => {
            // console.log( resp.token );
            // localStorage.setItem( 'email', resp.user.email );
            console.log( token );
            localStorage.setItem( 'token', token );
            window.location = 'chat.html';
        })
        .catch( console.warn );

}

const button = document.getElementById('google_signout');

button.onclick = () => {

    console.log( google.accounts.id );
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke( localStorage.getItem( 'email' ), done => {
        localStorage.clear();
        location.reload();
    });

}