const { User, Role, Category, Product } = require('../models');

/*
** USERS VALIDATORS
*/
const isRoleValid = async( role = '' ) => {
    
    // verificamos si el role esta registrado en la base de datos
    const roleExists = await Role.findOne({ role });
    if ( !roleExists ) {
        // si no existe entonces mandaremos un error
        throw new Error(`role ${ role } is not registered in the database`);
    }
}

const emailExists = async( email = '' ) => {

    // Verificar si el correo existe
    const emailExist = await User.findOne({ email });
    if( emailExist ) {
        throw new Error(`Email: ${ email } already exist.`);
    }
}

const userExistsById = async( id = '' ) => {

    // Verificar si el id existe
    const userExist = await User.findById( id );
    if( !userExist ) {
        throw new Error(`user id: ${ id } don't exist`);
    }
}


/*
** CATEGORIES VALIDATORS
*/
const categoryExistsById = async( id = '' ) => {

    // Verificar si el id existe
    const categoryExist = await Category.findById( id );
    if( !categoryExist ) {
        throw new Error(`category id: ${ id } don't exist`);
    }
}

// const categoryExistsByName = async( name = '' ) => {

//     // Verificar si el name existe
//     const categoryExist = await Category.findOne( { name: name.toUpperCase() } );
//     if( categoryExist ) {
//         throw new Error(`name: ${ name } already exist`);
//     }
// }

/*
** PRODUCTS VALIDATORS
*/
const productExistsById = async( id = '' ) => {

    // Verificar si el id existe
    const productExist = await Product.findById( id );
    if( !productExist ) {
        throw new Error(`product id: ${ id } don't exist`);
    }
}

/*
** COllections VALIDATORS
*/
const validCollections = ( collection = '', collections = [] ) => {

    const include = collections.includes( collection );

    if( !include ) {
        throw new Error(`collection: ${ collection } in not valid, ${ collections }`);
    }

    return true;
}


module.exports = {
    isRoleValid,
    emailExists,
    userExistsById,
    categoryExistsById,
    productExistsById,
    validCollections
    //categoryExistsByName
    //isCategoryValid
}
