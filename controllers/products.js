const { request, response } = require("express");
const { Product } = require('../models');

// obtener productos - paginado - total - populate
const getProducts = async( req = request, res = response ) => {
    
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [ total, products ] = await Promise.all([
        Product.countDocuments( query ),
        Product.find( query )
            .populate('user', 'name')
            .populate('category', 'name')
            .skip( Number( from ) )
            .limit( Number( limit ) )
    ]);

    res.json({
        total,
        products
    });
}

// obtener producto - populate {}
const getProduct = async( req = request, res = response ) => {

    const { id } = req.params;

    const product = await Product.findById( id )
                                 .populate('user', 'name')
                                 .populate('category', 'name');

    res.json( product );
}

const createProduct = async( req = request, res = response ) => {

    // const { name, price = 0, category, description } = req.body;
    const { status, user, ...body } = req.body;

    const productDB = await Product.findOne({ name: body.name });

    if ( productDB ) {
        return res.status(400).json({
            msg: `product: ${ productDB.name } already exist`
        });
    }

    // generar la data a guardar
    const data = {
        name: body.name.toUpperCase(),
        user: req.user._id,
        ...body
        // price,
        // category,
        // description,
    }

    //const category = new Category( data );
    const product = new Product( data );

    // guardar en DB
    await product.save();

    res.status(201).json( product );
}


// actualizar producto
const updateProduct = async( req = request, res = response ) => {

    const { id } = req.params;
    const { status, user, ...data } = req.body;

    if ( data.name ) {
        data.name = data.name.toUpperCase();
    }

    data.user = req.user;

    const product = await Product.findByIdAndUpdate( id, data, { new: true } )
                                 .populate('category', 'name')
                                 .populate('user', 'name');

    res.json({ product });
}

// borrar producto
const deleteProduct = async( req = request, res = response ) => {

    const { id } = req.params;

    const product = await Product.findByIdAndUpdate( id, { status: false }, { new: true } );

    res.json( product );
}


module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}