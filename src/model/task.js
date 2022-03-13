const { next } = require("mongodb/lib/operations/cursor_ops");
const mongoose = require("mongoose");
const validator = require("validator");
const TaskSchema =new mongoose.Schema(
  {
    task: {
      type: String,
      trim: true,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    important: {
      type: Boolean,
      default:false,
    },
    owner:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:'User'
    }
  },{
    timestamps:true
  }
)
TaskSchema.pre("save", async function (next){
      const task =this;
      next();
});
const Task = mongoose.model("Task",TaskSchema);
module.exports= Task;
