const { Router } = require('express');
const { check } = require('express-validator');

const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/products');
const { categoryExistsById, productExistsById } = require('../helpers/db-validators');
const { validateFields, validateJWT, isAdminRole } = require('../middlewares');


const router = Router();

// {{url}}/api/categories - path


// get - obtener todos los productos - publico
router.get('/', getProducts);

// get:id - obtener un producto por id - publico
router.get('/:id', [
    check('id', 'invalid ID').isMongoId(),
    check('id').custom( productExistsById ),
    validateFields
], getProduct);

// post - crear producto - privado - cualquier persona con un token valido
router.post('/', [
    validateJWT,
    check('name', 'The name is required').not().isEmpty(),
    check('category', 'invalid category ID').isMongoId(),
    check('category').custom( categoryExistsById ),
    //check('description', 'The description is required').not().isEmpty(),
    //check('price', 'invalid Price').isNumeric(),
    validateFields
], createProduct);

// put:id - actualizar - privado - cualquier persona con un token valido
router.put('/:id', [
    validateJWT,
    check('id', 'invalid ID').isMongoId(),
    check('id').custom( productExistsById ),
    //check('category', 'invalid category ID').isMongoId(),
    //check('category').custom( categoryExistsById ),
    validateFields
], updateProduct);

// delete:id - borrar una categoria - ADMIN
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'invalid ID').isMongoId(),
    check('id').custom( productExistsById ),
    validateFields
], deleteProduct);


module.exports = router;
