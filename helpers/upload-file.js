const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = ( files, validExtentions = ['png', 'jpg', 'jpeg', 'gif'], folder = '' ) => {

    return new Promise( ( resolve, reject ) => {
        const { file } = files;
        const nameCutted = file.name.split('.');
        const extention = nameCutted[ nameCutted.length - 1 ];

        // validar extension
        if ( !validExtentions.includes( extention ) ) {
            return reject(`Extention ${ extention } is not valid - ${ validExtentions }`);
        }

        const tempName = uuidv4() + '.' + extention; // temporal name
        const uploadPath = path.join( __dirname, '../uploads/', folder, tempName );

        file.mv(uploadPath, ( err ) => {
            if ( err ) {
                console.log( err );
                reject( err );
            }

            resolve( tempName );
        });
    });
}

module.exports = {
    uploadFile
}