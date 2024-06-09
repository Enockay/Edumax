const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const systemLogin = new mongoose.Schema({
    fullName : {type : String,required:true},
    username : {type :String,required :true },
    password :{type : String, required:true},
    uniqueId : {type : String,required:true}
});

systemLogin.pre('save',async function(next){
    if(!this.isModified("password")){
        return next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next()
});

systemLogin.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const system = mongoose.model("admin",systemLogin)

module.exports = system;

