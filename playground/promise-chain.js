require("../src/db/mongoose");
const User = require("../src/model/user");
//61f8f3293970a84478c43c09
// User.findByIdAndUpdate("61f8f3293970a84478c43c09", { age: 21 })
//   .then((res) => {
//     console.log(res);
//     return User.countDocuments({ age: 21 });
//   })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

  const UpdateAgeAndCount = async(id,age)=>{
    const user= await User.findByIdAndUpdate(id,{age});
    const count= await User.countDocuments({age});
    return count;
  }

  UpdateAgeAndCount('61f8f3293970a84478c43c09',21).then((count)=>{
    console.log(count);
  }).catch((e)=>{
    console.log(e);
  });