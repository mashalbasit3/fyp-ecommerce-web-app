import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},

    items: [{
            productId:  {type: mongoose.Schema.Types.ObjectId, ref: 'products'},
            quantity:   {type: Number, default: 1, min: 1, max: 10},
            totalPrice: {type: Number},
        }
    ],

    totalOrderPrice: {type: Number},

    orderDate:       {type: Date, default: Date.now},

    shippingAddress: {
        area:     {type: String},
        city:       {type: String},
        postalCode: {type: String},
        country:    {type: String},
    },

    paymentMethod: {type: String},
    transactionId: {type: String},

    orderStatus: {
        type: String,
        enum: ['processing', 'shipped', 'completed', 'cancelled'],
        default: "processing",
      },
});

const schema = mongoose.model('orders', orderSchema);
export default schema