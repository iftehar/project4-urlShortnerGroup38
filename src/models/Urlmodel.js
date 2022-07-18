const mongoose = require('mongoose')

const Urlschema = new mongoose.Schema({

     urlCode :{
        type:String,
        require:true,
        unique:true,
        trim:true,
        lowercase:true

     },
     longUrl :{
        type:String,
        require:true,

     },
     shortUrl : {
        type:String,
        require:true,
        unique:true,
     }


},{
    timestamps:true
})

module.exports = mongoose.model("Url",Urlschema);