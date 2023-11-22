import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true,},

    items: [{
            productId:  {type: mongoose.Schema.Types.ObjectId, ref: 'products'},
            quantity:   {type: Number, default: 1, min: 1, max: 10},
            totalPrice: {type: Number},
        }
    ],

    totalCartPrice: {type: Number},
    createdAt: {type: Date, default: Date.now},
});

const schema = mongoose.model("carts", cartSchema);
export default schema