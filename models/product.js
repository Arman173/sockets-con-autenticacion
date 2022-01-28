const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'The name is required'],
        // unique: true
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String
    },
    img: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    }
});


ProductSchema.methods.toJSON = function() {
    
    const { __v, _id, ...data } = this.toObject();
    data.uid = _id;
    return data;
}


module.exports = model( 'Product', ProductSchema );
