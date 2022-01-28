const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateFile } = require('../middlewares');
const { validCollections } = require('../helpers');
const { loadFile, updateImage, showImage, updateImageCloudinary } = require('../controllers/uploads');

const router = Router();

router.post('/', [ validateFile ], loadFile);

router.put('/:collection/:id', [
    validateFile,
    check('id', 'id must be IdMongo').isMongoId(),
    check('collection').custom( c => validCollections( c, ['users', 'products'] ) ),
    validateFields
], updateImageCloudinary);
// ], updateImage);

router.get('/:collection/:id', [
    check('id', 'id must be IdMongo').isMongoId(),
    check('collection').custom( c => validCollections( c, ['users', 'products'] ) ),
    validateFields
], showImage);

module.exports = router;
