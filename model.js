const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    number:{type:Number},
    Text:{
        type:String
    }
})

const live = mongoose.model("live",schema);
module.exports = live;