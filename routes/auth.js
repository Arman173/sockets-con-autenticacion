const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields, validateJWT } = require('../middlewares');

const { login, googleSignIn, authenticate, renewToken } = require('../controllers/auth');


const router = Router();

// router.post('/', [
//     validateJWT,
//     validateFields
// ], authenticate);

router.get('/', validateJWT, renewToken );

router.post('/login', [
    check('email', 'email is required').isEmail(),
    check('password', 'password is required').not().isEmpty(),
    validateFields
], login);

router.post('/google', [
    check('id_token', 'google id_token is required').not().isEmpty(),
    validateFields
], googleSignIn);

module.exports = router;
