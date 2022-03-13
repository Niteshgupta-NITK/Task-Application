const bcrypt = require("bcryptjs/dist/bcrypt");
const { findOne } = require("mongodb/lib/operations/collection_ops");
const mongoose = require("mongoose");
const validator = require("validator");
const { farsiLocales } = require("validator/lib/alpha");
const jwt = require("jsonwebtoken");
const Task= require("./task");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error("Imvalid email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    min: 7,
    validate(val) {
      if (val.toLowerCase() == "password" || val.length < 7) {
        throw new Error("Invalid Password");
      }
    },
  },
  age: {
    type: Number,
    defualt: 18,
    validate(val) {
      if (val <= 0) {
        throw new Error("Age should be postiive");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  avatar:{
     type:Buffer,
  }
},{timestamps:true});

//Define relatiiionship between task and users
UserSchema.virtual('tasks',{
   ref:'Task',
   localField:'_id',
   foreignField:'owner'
});
//Define public profile to be sent back to user
UserSchema.methods.getPublicProfile = function () {
  const user = this;
  const userobj = user.toObject();
  delete userobj.password;
  delete userobj.tokens;
  delete userobj.avatar;
  return userobj;
};

//Define method for creating token
UserSchema.methods.genauthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() },process.env.STRING);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
//Define credentials
UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User Doesnt exist"); 
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Username and Password Doesnt macth!");
  }
  return user;
};
//hash password before saving
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
//remove tasks when user is deleted
UserSchema.pre("remove",async function(next){
   const user =this;
await  Task.deleteMany({owner:user._id});
   next();
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
