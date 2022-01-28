const bcryptjs = require('bcryptjs');
const { request, response } = require('express');

const User = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');


const authenticate = async( req = request, res = response ) => {

    const user = await User.findById( req.user._id );

    res.status(200).json( user );
}


const renewToken = async( req = request, res = response ) => {

    const { user } = req;
    
    // generar JWT ( json web token )
    const token = await generateJWT( user._id );

    res.json({
        user,
        token
    });

}


const login = async( req = request, res = response ) => {

    const { email, password } = req.body;

    try {

        // verificar si el email existe
        const user = await User.findOne({ email });
        if ( !user ) {
            return res.status(400).json({
                msg: 'USER / PASSWORD incorrect - email'
            });
        }

        // verificar si el usuario está activo
        if ( !user.status ) {
            return res.status(400).json({
                msg: 'USER / PASSWORD incorrect - status: false'
            });
        }

        // verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, user.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'USER / PASSWORD incorrect - password'
            });
        }

        // generar JWT ( json web token )
        const token = await generateJWT( user._id );

        res.json({
            msg: 'Login ok',
            user,
            token
        });

    } catch ( error ) {
        console.log( error );
        return res.status(500).json({
            msg: 'talk to the administrator'
        });
    }

}


const googleSignIn = async( req = request, res = response ) => {

    const { id_token } = req.body;

    try {

        const { email, name, img } = await googleVerify( id_token );

        let user = await User.findOne({ email });

        if ( !user ) {
            // hay que crear el usuario
            const data = {
                name,
                email,
                password: ';)',
                img,
                google: true
            };
            
            user = new User( data );
            await user.save();
        }
        
        // si el usuario en DB
        if ( !user.status ) {
            return res.status(401).json({
                msg: 'Talk to administrator, user locked'
            });
        }

        // generar el JWT
        const token = await generateJWT( user._id );


        res.json({
            user,
            token
        });
        
    } catch ( error ) {
        res.status(400).json({
            ok: false,
            msg: 'token could not be verificate'
        });
    }

}


module.exports = {
    renewToken,
    login,
    authenticate,
    googleSignIn
}
