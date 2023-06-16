const mongoose = require("mongoose");
const conn = require("../db/conn")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        //console.log(token);
        return token;
    } catch(error){
        console.log(error);
    }
}

// userSchema.pre("save", async function(next){
//     // const passwordHah = await bcrypt.hash(password, 10);
    
//     this.password = await bcrypt.hash(this.password, 10);
//     //console.log(`the current password is ${this.password}`);
//     next();
// });

const Register = new mongoose.model("RegisteredUser", userSchema);
module.exports = Register;