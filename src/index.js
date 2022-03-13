const express = require("express");
require("./db/mongoose");
const app = express();
const userrouter =require('./routers/user');
const taskrouter=require('./routers/task');
require('dotenv').config()

const port = process.env.PORT;
// console.log(process.env);
app.use(express.json());
app.use(userrouter);
app.use(taskrouter);

app.listen(port, () => {
  console.log("server is up running at port "+ port);
});
