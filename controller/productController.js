import Product from "../models/productModel.js"

//create Product
export const createProduct = async(req, res) => {
    try{
        const {title, description, price, category, productPicUrl} = req.body;
        console.log(req.body)
        if (!title || !description || !price || !category){
            res.status(400).send({message:"Please fill all required fields."})
        }
        const newProduct = new Product({title,description,price,category,productPicUrl})
        await newProduct.save()
        
        res.status(201).send(newProduct)
    } catch(error){
        res.status(500).send({message: error.message})
        console.log(error)
    }
};

//get all data
export const getAllProducts = async(req, res) => {
    try{
        let page = req.query.page;
        let pageLimit = req.query.limit;
        
        const products = await Product.find()
        .skip((page-1)*pageLimit)
        .limit(pageLimit);

        if(!products){
            res.status(404).send({message: "Error: Couldn't get products data"});
        }
        res.status(200).send(products);
    } catch (error){
        res.status(500).send({message: error.message});
    }
}

// find by param
export const getSingleProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id);

        if(!product){
            res.status(404).send({message:"Error: product not found"});
        }
        res.status(200).send(product);
    } catch (error){
        res.status(500).send({message: error.message});
    }
}


// update single product
export const updateSingleProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body,{new:true});
        
        if(!product){
            return res.status(404).send({message:"Error: product not found"});
        }
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}

//delete single product
export const deleteSingleProduct = async(req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id)
        if (!product){
            return res.status(404).send({message: "Error: Couldn't delete. Product not found"})
        }
        res.status(204).send({message: "Successfully deleted product"})
    } catch (error){
        res.status(500).send({message: error.message})
    }
}