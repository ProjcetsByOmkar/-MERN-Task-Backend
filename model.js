const mongoose = require("mongoose")

const tschema = mongoose.Schema({t:String},{versionKey:false})

const tmodel = mongoose.model('ts',tschema)

module.exports = tmodel;