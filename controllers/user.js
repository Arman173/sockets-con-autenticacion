const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const usersGet = async( req = request, res = response ) => {

    // const { q, name = 'No name', id, apikey } = req.query;
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [ total, users ] = await Promise.all([
        User.countDocuments( query ),
        User.find( query )
            .skip( Number( from ) )
            .limit( Number( limit ) )
    ]);

    res.json({
        total,
        users
    });
}

const getUser = async( req = request, res = response ) => {

    const { id } = req.params;

    const user = await User.findById( id );

    res.json( user );
}

const userPost = async( req, res = response ) => {
    
    const { name, email, password, role } = req.body;
    const user = new User( { name, email, password, role } );

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    // Guardar en la base de datos
    await user.save();

    res.status(201).json({
        msg: 'post API - controller',
        user
    });
}

const userPut = async( req = request, res = response ) => {

    const { id } = req.params;
    const { _id, password, google, email, ...rest } = req.body;

    // validar contra base de datos
    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync( password, salt );
    }

    const user = await User.findByIdAndUpdate( id, rest, { new: true } );

    res.json( user );
}

const userPatch = ( req, res = response ) => {
    res.json({
        msg: 'patch API - controller'
    });
}

const userDelete = async( req, res = response ) => {

    const { id } = req.params;

    const user = await User.findByIdAndUpdate( id, { status: false }, { new: true } );


    res.json( user );
}


module.exports = {
    usersGet,
    getUser,
    userPost,
    userPut,
    userPatch,
    userDelete
}
