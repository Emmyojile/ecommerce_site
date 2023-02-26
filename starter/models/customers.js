const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');



const customerSchema = mongoose.Schema({
    username : {
        type : String,
        min : [3, 'Username is too short']
    },

    email : {
        type : String,
        validate : [validator.isEmail, 'Email is not valid']
    },

    password : {
        type : String,
        min : [3, 'Password is too short']
    },

    confirmPassword : {
        type : String,
        validate : {
            validator : function (el) {
                return el === this.password;
            }
        }
    }
})


customerSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

customerSchema.methods.createJWT = function () {
    return jwt.sign({id : this._id, username : this.username},
        process.env.JWT_SECRET,
        {expiresIn : process.env.JWT_LIFETIME}
        )
}

customerSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model('Customer', customerSchema)