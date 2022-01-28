const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { User, Category, Product } = require('../models');

const allowedCollections = [
    'users',
    'categories',
    'products',
    'roles'
];

const searchUsers = async( term = '', res = response ) => {

    const isMongoId = ObjectId.isValid( term );

    if( isMongoId ) {
        const user = await User.findById( term );
        return res.json({
            results: ( user ) ? [ user ] : []
        });
    }

    // expresion regular para ser incensible de minusculas y mayuscular en la busqueda
    const regex = new RegExp( term, 'i' );

    // filtros de la busqueda
    const query = {
        $or: [{ name: regex }, { email: regex }],
        $and: [{ status: true }]
    }

    const users = await User.find( query );

    res.json({
        total: users.length,
        results: users
    });
}

const searchCategories = async( term, res = response ) => {

    const isMongoId = ObjectId.isValid( term );

    if( isMongoId ) {
        const category = await Category.findById( term )
                                       .populate('user', 'name');
        return res.json({
            results: ( category ) ? [ category ] : []
        });
    }

    // expresion regular para ser incensible de minusculas y mayuscular en la busqueda
    const regex = new RegExp( term, 'i' );

    // filtros de la busqueda
    const query = { name: regex, status: true };

    const categories = await Category.find( query )
                                     .populate('user', 'name');

    res.json({
        total: categories.length,
        results: categories
    });
}

const searchProducts = async( term, res = response ) => {

    const isMongoId = ObjectId.isValid( term );

    if( isMongoId ) {
        const product = await Product.findById( term )
                                     .populate('category', 'name')
                                     .populate('user', 'name');
        return res.json({
            results: ( product ) ? [ product ] : []
        });
    }

    // expresion regular para ser incensible de minusculas y mayuscular en la busqueda
    const regex = new RegExp( term, 'i' );

    // filtros de la busqueda
    const query = { name: regex, status: true };

    const products = await Product.find( query )
                                  .populate('category', 'name')
                                  .populate('user', 'name');

    res.json({
        total: products.length,
        results: products
    });
}


const search = ( req = request, res = response ) => {

    const { collection, term } = req.params;

    if ( !allowedCollections.includes( collection ) ) {
        res.status(400).json({
            msg: `the allowed collections are ${ allowedCollections }`
        });
    }

    switch ( collection ) {
        case 'users':
            searchUsers( term, res );
        break;
        case 'categories':
            searchCategories( term, res );
        break;
        case 'products':
            searchProducts( term, res );
        break;
        default:
            res.status(500).json({
                msg: 'this search is missing to implement'
            });
    }
}

module.exports = {
    search
}