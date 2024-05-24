const mongoose = require("mongoose");

const databaseConn = async (url) => {
    try{
      const connect =  await mongoose.connect(url)
        console.log(`successfully connected to the  database` )
    }catch(error){
        console.log(`error in connecting to the databas ${error}`)
    }
}

module.exports = databaseConn