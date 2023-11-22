import Order from "../models/orderModel.js"
import User from "../models/userModel.js"
import {transporter} from '../utils/email.js'

// create order
export const createOrder = async (req,res) => {
    try{
        const {items, totalOrderPrice, shippingAddress,
            paymentMethod, transactionId} = req.body;
        
        const {userId} = req.user;
   
        if (userId && items && totalOrderPrice && shippingAddress && paymentMethod
                && transactionId){
            
            const order = new Order({userId, items, totalOrderPrice, shippingAddress,
                paymentMethod, transactionId});
        
            await order.save();
            return res.status(200).send(order)
    
        } else{
            return res.status(400).send({message: "Please provide all required fields."})
        }

    } catch (error){
        res.status(400).send(error.message)
    }
}

export const orderStatusUpdate = async (req,res) => {
    try{
        const {orderId} = req.params;
        const {userId, orderStatus} = req.body;
        
        let order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).send({message: "Order doesn't exist"})
        }
        order.orderStatus = orderStatus;
        await order.save();

        let user = await User.findById(userId)

        const mailOptions = {
            from: process.env.TRANS_EMAIL,
            to: user.email,
            subject: 'Order Status',
            text: `Your order status is: ${orderStatus}`
        };
    
        transporter.sendMail(mailOptions, (error)=>{
            if(error){
            console.error('Error sending email:', error);
            return res.status(500).send({error: 'Internal server error'});
            } 
        });
        
        res.status(200).send({message: "Order status updated successfully", order})

    } catch(error){
        res.status(400).send({message: error.message})
    }
}

export const getUserOrders = async (req,res) => {
    try {
        const {userId} = req.user;
        let page = req.query.page;
        let pageLimit = req.query.limit

        const orders = await Order.find({userId})
        .populate('userId', 'username email firstName lastName')
        .populate('items.productId', 'title price productPicUrl')
        .skip((page-1)*pageLimit)
        .limit(pageLimit);
        
        res.status(200).send(orders);

    } catch (error) {
        res.status(400).send({message: error.message})
    }
}


export const getSingleOrder = async (req,res) => {
    try {
        const {orderId} = req.params

        const orders = await Order.findById(orderId)
        .populate('userId', 'username email firstName lastName')
        .populate('items.productId', 'title price productPicUrl')

        res.status(200).send(orders);

    } catch (error) {
        res.status(400).send({message: error.message})
    }
}

export const getAllOrder = async (req,res) => {
    try {

        const orders = await Order.find()
        .populate('userId', 'username email firstName lastName')
        .populate('items.productId', 'title price productPicUrl')
        
        res.status(200).send(orders);

    } catch (error) {
        res.status(400).send({message: error.message})
    }
}
