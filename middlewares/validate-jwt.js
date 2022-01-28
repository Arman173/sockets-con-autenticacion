const jwt = require('jsonwebtoken');
const { request, response } = require('express');

const User = require('../models/user');


const validateJWT = async( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            msg: 'there is no token in the request'
        });
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRET_KEY );

        const user = await User.findById( uid );

        if ( !user ) {
            return res.status(401).json({
                msg: 'invalid token - user does not exist in DB'
            });
        }        

        // verificar si el uid tiene el estado en true
        if ( !user.status ) {
            return res.status(401).json({
                msg: 'invalid token - user with status false'
            });
        }

        req.user = user;
        next();
        
    } catch ( error ) {
        console.log( error );
        res.status(401).json({
            msg: 'invalid token'
        });
    }
}


module.exports = {
    validateJWT,
}
