const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: false, unique: true },
    password: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: false },
    gender: { type: String, required: false },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    department: { type: String, required: false },
    TSC: { type: String, required: false },
    role: {type:String,required:false}
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const teacherLoginModel = mongoose.model('User', UserSchema);

module.exports = teacherLoginModel;
