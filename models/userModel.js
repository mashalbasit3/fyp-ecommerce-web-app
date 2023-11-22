import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email:      {type: String, unique: true, required: true},
    password:   {type: String, required: true},
    confirmPassword: {type: String},
    isAdmin:    {type: Boolean, require: true, default: false},
    userPicUrl: {type: String,},
    phone:      {type: Number},
    address:    {type: String},
    firstName:  {type: String, required: true},
    lastName:   {type: String, required: true},
    resetToken: {type: String},
    resetTokenExpiration: {type: Date}
})

const schema = mongoose.model("users", userSchema);
export default schema