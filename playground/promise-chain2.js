require("../src/db/mongoose");
const Task = require("../src/model/task");

// Task.findByIdAndDelete("61f639b4ae72c438f49156eb")
//   .then((res) => {
//     console.log(res);
//     return Task.find({ completed: false });
//   })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((e) => {
//     console.log(e);
//   });
const DeleteAndCount = async (id) => {
  const b= await Task.findByIdAndDelete(id);
  const left = await Task.countDocuments({ completed: false });
  return left;
};
DeleteAndCount("61f639b4ae72c438f49156eb")
  .then((count) => {
    console.log(count);
  })
  .catch((e) => {
    console.log(e);
  });
