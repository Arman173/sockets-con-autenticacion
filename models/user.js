const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: [ true, 'The name is required' ]
    },
    email: {
        type: String,
        required: [ true, 'The email is required' ],
        unique: true
    },
    password: {
        type: String,
        required: [ true, 'The Password is required' ]
    },
    img: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
        // enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

UserSchema.methods.toJSON = function() {
    
    const { __v, _id, password, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model( 'User', UserSchema );

// const params = {
//     name:'',
//     email:'sdfs@sdfs.com',
//     password:'sdf323',
//     img:'sdfsdf_url',
//     role:'sdfwse',
//     status: false,
//     google: false
// }

