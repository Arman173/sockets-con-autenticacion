const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { request, response } = require('express');
const { uploadFile } = require('../helpers');

const { User, Product } = require('../models');

const loadFile = async( req = request, res = response ) => {

    try {
        
        // const name = await uploadFile( req.files, ['txt', 'md'], 'texts' );
        const name = await uploadFile( req.files, undefined, 'imgs' );
        res.json({ name });

    } catch ( error ) {
        res.status(400).json({ msg: error });
    }
}

const updateImage = async( req = request, res = response ) => {

    const { id, collection } = req.params;

    let model;
    
    switch ( collection ) {
        case 'users':
            model = await User.findById( id );
            if( !model ) {
                return res.status(400).json({
                    msg: `User with id: ${ id } dont exist`
                });
            }
        break;

        case 'products':
            model = await Product.findById( id );
            if( !model ) {
                return res.status(400).json({
                    msg: `Product with id: ${ id } dont exist`
                });
            }
        break;
    
        default:
            return res.status(500).json({ msg: 'this validation is missing to implement' });
    }

    // limpiar imagenes previas
    if ( model.img ) {
        // hay que borrar la imagen del servidor
        const imagePath = path.join( __dirname, '../uploads', collection, model.img );

        if( fs.existsSync( imagePath ) ) {
            fs.unlinkSync( imagePath );
        }
    }

    const name = await uploadFile( req.files, undefined, collection )
    model.img = name;

    await model.save();

    res.json( model );
}


const showImage = async( req = request, res = response ) => {

    const { id, collection } = req.params;

    let model;
    
    switch ( collection ) {
        case 'users':
            model = await User.findById( id );
            if( !model ) {
                return res.status(400).json({
                    msg: `User with id: ${ id } dont exist`
                });
            }
        break;

        case 'products':
            model = await Product.findById( id );
            if( !model ) {
                return res.status(400).json({
                    msg: `Product with id: ${ id } dont exist`
                });
            }
        break;
    
        default:
            return res.status(500).json({ msg: 'this validation is missing to implement' });
    }

    // verificamos si el modelo tiene una imagen
    if ( model.img ) {
        // enviamos la imagen
        const imagePath = path.join( __dirname, '../uploads', collection, model.img );

        if( fs.existsSync( imagePath ) ) {
            return res.sendFile( imagePath );
        }
    }

    const imageNotFoundPath = path.join( __dirname, '../assets/no-image.jpg' );
    res.sendFile( imageNotFoundPath );
}


const updateImageCloudinary = async( req = request, res = response ) => {

    const { id, collection } = req.params;

    let model;
    
    switch ( collection ) {
        case 'users':
            model = await User.findById( id );
            if( !model ) {
                return res.status(400).json({
                    msg: `User with id: ${ id } dont exist`
                });
            }
        break;

        case 'products':
            model = await Product.findById( id );
            if( !model ) {
                return res.status(400).json({
                    msg: `Product with id: ${ id } dont exist`
                });
            }
        break;
    
        default:
            return res.status(500).json({ msg: 'this validation is missing to implement' });
    }

    // limpiar imagenes previas
    if ( model.img ) {
        // hay que borrar la imagen del servidor ( cloudinary )
        const nameArr = model.img.split('/');
        const name = nameArr[ nameArr.length - 1 ];
        const [ public_id ] = name.split('.');

        cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    model.img = secure_url;

    await model.save();

    res.json( model );
}


module.exports = {
    loadFile,
    updateImage,
    showImage,
    updateImageCloudinary
}