const { request, response } = require("express");
const { Category } = require('../models');

// obtener categorias - paginado - total - populate
const getCategories = async( req = request, res = response ) => {
    
    // const { q, name = 'No name', id, apikey } = req.query;
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [ total, categories ] = await Promise.all([
        Category.countDocuments( query ),
        Category.find( query )
            .populate('user', 'name')
            .skip( Number( from ) )
            .limit( Number( limit ) )
    ]);

    res.json({
        total,
        categories
    });
}

// obtener categoria - populate {}
const getCategory = async( req = request, res = response ) => {

    const { id } = req.params;

    const category = await Category.findById( id ).populate('user', 'name');

    res.json( category );
}

const createCategory = async( req = request, res = response ) => {

    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name });

    if ( categoryDB ) {
        return res.status(400).json({
            msg: `Category ${ categoryDB.name } already exist`
        });
    }

    // generar la data a guardar
    const data = {
        name,
        user: req.user._id
    }

    const category = new Category( data );

    // guardar en DB
    await category.save();

    res.status(201).json( category );
}


// actualizar categoria
const updateCategory = async( req = request, res = response ) => {

    const { id } = req.params;
    const { status, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;
    data.status = status;

    const category = await Category.findByIdAndUpdate( id, data, { new: true } );

    res.json({ category });
}

// borrar categoria
const deleteCategory = async( req = request, res = response ) => {

    const { id } = req.params;

    const category = await Category.findByIdAndUpdate( id, { status: false }, { new: true } );

    res.json( category );
}


module.exports = {
    getCategories,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory
}