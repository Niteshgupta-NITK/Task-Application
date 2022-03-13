const mongoose = require("mongoose");
const validtaor = require("validator");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
