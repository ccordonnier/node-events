const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username : {type: String, required: true},
    mail : {type: String, required: true},
    password : {type: String, required: true},
    firstname : {type: String, required: true},
    lastname : {type: String, required: true},
    role : {type: String, required: true},
    avatar: {type: String, required:false},
    age: { type: Number, required: false},
    registration: { type: Date, required: true}
});

// play function before save into display: 'block',
userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

userSchema.statics.login = async function(mail, password) {
    const user = await this.findOne({mail:mail});
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

