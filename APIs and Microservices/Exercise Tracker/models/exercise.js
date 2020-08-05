const mongoose=require("mongoose");

var ExerciseSchema=new mongoose.Schema({
  description: String,
  duration: Number,
  date: {type:Date, default: Date.now()},
});

module.exports=mongoose.model("Exercise", ExerciseSchema);