const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateJWT = ( uid = '' ) => {

    return new Promise( ( resolve, reject ) => {

        const payload = { uid };

        jwt.sign( payload, process.env.SECRET_KEY, {
            expiresIn: '4h'
        }, ( err, token ) => {
            
            if( err ) {
                console.log( err );
                reject( 'the token could not be generate');
            } else {
                resolve( token );
            }
        });

    });
}


const checkJWT = async( token = '' ) => {

    try {
        
        if ( token.length < 10 ) return null;

        const { uid } = jwt.verify( token, process.env.SECRET_KEY );
        const user = await User.findById( uid );

        if ( !user ) return null;

        if ( !user.status ) return null;

        return user;


    } catch (error) {
        return null;
    }
}


module.exports = {
    generateJWT,
    checkJWT
}
