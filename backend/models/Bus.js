const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
    busNumber:{
        type:String,
        required:true
    },
    routeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Route"
    },
    currentLocation:{
        lat:Number,
        lng:Number
    },
    speed:{
        type:Number,
        default:30
    }
});

module.exports = mongoose.model("Bus",busSchema);