const { request, response } = require('express');

const isAdminRole = ( req = request, res = response, next ) => {

    if ( !req.user ) {
        return res.status(500).json({
            msg: 'you want to validate the role before validating the token'
        });
    }
    
    const { role, name } = req.user;

    if ( role != 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${ name } does not be a admin - can not do this`
        });
    }
    
    next();
}


const hasRole = ( ...roles ) => {
    return ( req = request, res = response, next ) => {
        // console.log( roles, req.user.role );
        if ( !req.user ) {
            return res.status(500).json({
                msg: 'you want to validate the role before validating the token'
            });
        }

        if ( !roles.includes( req.user.role ) ) {
            return res.status(401).json({
                msg: `service require one of this services: ${ roles }`
            });
        }

        next();
    }
}


module.exports = {
    isAdminRole,
    hasRole
}
