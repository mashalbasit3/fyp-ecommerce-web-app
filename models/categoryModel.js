import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name:           {type: String, required: true, unique: true},
    description:    {type:String},
    created_at:     {type: Date, default: Date.now},
    products:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'products'}]
});

const schema = mongoose.model("categories", categorySchema);
export default schema;