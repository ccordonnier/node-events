const mongoose = require("mongoose");

const categorieSchema = mongoose.Schema({
  _id: {type:String, required:true},
  name: {type:String, required:true}
});

module.exports = mongoose.model("Categories", categorieSchema);