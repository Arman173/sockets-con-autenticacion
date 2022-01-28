const { Router } = require('express');
const { check } = require('express-validator');

const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categories');
const { categoryExistsById, categoryExistsByName } = require('../helpers/db-validators');
const { validateFields, validateJWT, isAdminRole } = require('../middlewares');


const router = Router();

// {{url}}/api/categories - path


// get - obtener todas las categorias - publico
router.get('/', getCategories);

// get:id - obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'invalid ID').isMongoId(),
    check('id').custom( categoryExistsById ),
    validateFields
], getCategory);

// post - crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validateJWT,
    check('name', 'The name is required').not().isEmpty(),
    // check('name').custom( categoryExistsByName ),
    validateFields
], createCategory);

// put:id - actualizar - privado - cualquier persona con un token valido
router.put('/:id', [
    validateJWT,
    check('name', 'name is required').not().isEmpty(),
    // check('name').custom( categoryExistsByName ),
    check('id', 'invalid ID').isMongoId(),
    check('id').custom( categoryExistsById ),
    validateFields
], updateCategory);

// delete:id - borrar una categoria - ADMIN
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'invalid ID').isMongoId(),
    check('id').custom( categoryExistsById ),
    validateFields
], deleteCategory);


module.exports = router;
