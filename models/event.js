const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
    _id : {type:String, required:true},
    title: {type: String, required: true},
    description:{type: String, required: false},
    date:{type: Date, required: true},
    time:{type: String, required: false},
    address:{type: String, required: false},
    city:{type: String, required: false},
    image:{type: String, required: false},
    category:{type: String, required: false},
    creator:{type: String, required: true},
    places:{type: Number, required: false},
    price:{type: Number, required: false},
    participants:{type: Array, required: false},
    color: {type: String, required:false}
});

module.exports = mongoose.model("Event", eventSchema);