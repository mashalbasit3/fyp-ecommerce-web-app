import express from "express";

import {registerUser, login, logout, getAllUsers, getSingleUser, getSingleUserAdmin,
updateSingleUser, deleteSingleUser, updatePassword, forgetPassowrdOTP, 
verifyOtp, resetPassword} from "../controller/userController.js";

import {createProduct, getAllProducts, getSingleProduct, updateSingleProduct,
deleteSingleProduct} from "../controller/productController.js";

import {createCategory, getSingleCategory, getAllCategories,
updateSingleCategory, deleteSingleCategory} from "../controller/categoryController.js"

import {createCart, addProductToCart, deleteCartProduct, deleteAllCartProducts,
getCartContents} from "../controller/cartController.js";

import {createOrder, orderStatusUpdate, getUserOrders, getSingleOrder,
getAllOrder} from '../controller/orderController.js'

import {verifyToken} from '../middlewares/middelwares.js'

const router = express.Router();

//User Routes
router.post("/user/register", registerUser)
router.post("/user/login", login)
router.post("/user/logout", logout)
router.get("/user/all", getAllUsers)
router.get("/user/admin/:userId", getSingleUserAdmin)
router.get("/user", verifyToken, getSingleUser)
router.put("/user", verifyToken, updateSingleUser)
router.delete("/user", verifyToken, deleteSingleUser)
router.put("/user/update-password", verifyToken, updatePassword)
router.post("/user/forget-password", forgetPassowrdOTP)
router.put("/user/verify-otp", verifyOtp)
router.put("/user/reset-password", resetPassword)


//Product Routes
router.post("/products", createProduct)
router.get("/products", getAllProducts)
router.get("/products/:id", getSingleProduct)
router.put("/products/:id", updateSingleProduct)
router.delete("/products/:id", deleteSingleProduct)

//Category Routes
router.post("/categories", createCategory)
router.get("/categories", getAllCategories)
router.get("/categories/:name", getSingleCategory)
router.put("/categories/:categoryId", updateSingleCategory)
router.delete("/categories/:name", deleteSingleCategory)

//Cart Routes
router.post("/cart", createCart)
router.put("/cart", verifyToken, addProductToCart)
router.delete("/cart", verifyToken, deleteAllCartProducts)
router.delete("/cart/:productId", verifyToken, deleteCartProduct)
router.get("/cart", verifyToken, getCartContents)

//Order Routes
router.post("/orders", verifyToken, createOrder)
router.put("/orders/:orderId", orderStatusUpdate)
router.get("/orders/all", getAllOrder)
router.get("/orders", verifyToken, getUserOrders)
router.get("/orders/:orderId", getSingleOrder)

export {router}
