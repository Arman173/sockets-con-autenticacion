
const dbValitators  = require('./db-validators');
const generateJwt   = require('./generate-jwt');
const googleVerify  = require('./google-verify');
const uploadFile    = require('./upload-file');

module.exports = {
    ...dbValitators,
    ...generateJwt,
    ...googleVerify,
    ...uploadFile,
}
