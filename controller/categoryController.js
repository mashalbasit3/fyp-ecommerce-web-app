import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';

//create category
export const createCategory = async (req, res) => {
    try {
        const {name, description} = req.body;
        if (!name){
            res.status(400).send({message:"Please provide category name."})
        }
        if (!description){
            res.status(400).send({message:"Please provide category description."})
        }

        const newCategory = new Category({name, description});
        await newCategory.save();

        res.status(201).send(newCategory);

    } catch (error) {
        res.status(500).send({message: error.message});
    }
};


//get single category
export const getSingleCategory = async (req,res) => {
    try {
        const {name} = req.params;
        console.log(name)
        const category = await Category.findOne({ name }).populate('products' );
        console.log(category)

        if(!category){
           return res.status(404).send({message:"Error: Category not found"});   
        }

        res.status(200).send(category);
    } catch (error){
        res.status(500).send({message: error.message});
    }
}


//get all categories
export const getAllCategories = async(req, res) => {
    try{
        let page = req.query.page;
        let pageLimit = req.query.limit;
        
        const categories = await Category.find()
        .skip((page-1)*pageLimit)
        .limit(pageLimit);

        if(!categories){
            res.status(404).send({message: "Error: Couldn't get categories data"});
        }
        res.status(200).send(categories);
    } catch (error){
        res.status(500).send({error: error.message});
    }
}

// update single category
export const updateSingleCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // Find the category
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).send({ message: 'Category not found.' });
        }

        // Get the product IDs from the products array in the category
        const existingProductIds = category.products.map(product => product.toString());

        // Find all products with the specified category ID
        const allProducts = await Product.find({ category: categoryId });

        // Get the product IDs from the database
        const currentProductIds = allProducts.map(product => product._id.toString());

        // Find products that exist in the category but are not in the database
        const productsToRemove = existingProductIds.filter(id => !currentProductIds.includes(id));

        // Remove products that are not in the database
        await Category.findByIdAndUpdate(categoryId, {
            $pullAll: { products: productsToRemove },
        });

        // Find new products that are in the database but not in the category
        const newProductsToAdd = currentProductIds.filter(id => !existingProductIds.includes(id));

        // Add new products to the category's products array
        await Category.findByIdAndUpdate(categoryId, {
            $addToSet: { products: { $each: newProductsToAdd } },
        });

        res.status(200).send({ message: 'Category products updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
};



//delete single category
export const deleteSingleCategory = async(req, res) => {
    try {
        const {name} = req.params;
        const category = await Category.findOneAndDelete(name)
        if (!category){
            res.status(404).send({message: "Error: Couldn't delete. Category not found"})
        }
        res.status(204).send({message: "Successfully deleted category"})
    } catch (error){
        res.status(500).send({message: error.message})
    }
}