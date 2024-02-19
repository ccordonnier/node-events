const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    _id : {type:String, required:true},
    username : {type: String, required: false},
    email : {type: String, required: true},
    password : {type: String, required: true},
    firstname : {type: String, required: true},
    lastname : {type: String, required: true},
    role : {type: Array, required: false},
    avatar: {type: String, required:false},
    registration: { type: Date, required: true},
    birthdate: {type: Date, required: true}
});

// play function before save into display: 'block',
userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

/**
 * Search a user from email and compare their 
 * @param {String} email 
 * @param {String} password 
 * @returns {Object} user 
 */
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({email:email});
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email')
};

module.exports = mongoose.model("User", userSchema);

