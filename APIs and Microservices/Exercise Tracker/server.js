const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const User=require("./models/user");
const Exercise=require("./models/exercise");

// Require dotenv for access data from .env file in local environment.
// No need to do this for development on online platform like Glitch.
require('dotenv').config();

//Connect to Database.
mongoose.connect(process.env.MLAB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected"))
  .catch(err => console.log(err));

// Middleware
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Add New User
app.post("/api/exercise/new-user", (req, res) => {
  let newUsername=req.body.username;
  User.findOne({username: newUsername}, (err, foundUser) => {
    if(err){
      console.log(err)
    } else if(foundUser){
      res.send("User Already Exist");
    } else if(!foundUser){
      User.create({
        username: newUsername
      }, (err, newUser) => {
        if(err) console.log(err);
        res.json({username: newUser.username, _id: newUser._id});
      })
    }
  })
});

// Get an Array of All Users
app.get("/api/exercise/users", (req, res) => {
  User.find({}, (err, foundUser) => {
    res.send(foundUser.map(a => ({
      id: a._id, username: a.username
    })));
  })
});

// Add New Exercise Data
app.post("/api/exercise/add", (req, res) => {
  let userId=req.body.userId;
  let description=req.body.description;
  let duration=req.body.duration;
  let exerciseDate=(req.body.date);
  let date;
  exerciseDate ? date=new Date(exerciseDate).toUTCString() : date=new Date();
  // Create New Exercise
  Exercise.create({
    description: description,
    duration: duration,
    date: date,
  }, (err, newExercise) => {
    if(err) console.log(err);
    // Find User With Given UserId
    User.findOne({_id: userId}, (err, foundUser) => {
      if(err) {
        console.log(err);
      }else if(!foundUser){
        res.send("Unknown User ID :|");
      }
      // Adding New Exercise Data
      foundUser.log.push(newExercise);
      foundUser.count++;
      foundUser.save((err, savedUser) => {
        err ? console.log(err) : res.json({"_id": savedUser._id, "username": savedUser.username,"date": newExercise.date.toDateString(), "duration": newExercise.duration, "description": newExercise.description});
      })
    })
  })
});

// Get the user's exercise data.
app.get("/api/exercise/log?", (req, res) => {
  let userId;
  let from;
  let to;
  let limit;

  if(req.query.userId) userId=req.query.userId
  if(req.query.from) from=new Date(req.query.from).valueOf()
  if(req.query.to) to=new Date(req.query.to).valueOf()
  if(req.query.limit) limit=req.query.limit
  
  User.findOne({_id: userId}).populate('log').exec((err, populatedData) => {
    if(err) console.log(err);
    from ? populatedData.log=populatedData.log.filter(obj => new Date(obj.date).valueOf() >= from) : null;
    to ? populatedData.log=populatedData.log.filter(obj => new Date(obj.date).valueOf() <= to) : null;
    limit ? populatedData.log.splice(limit, populatedData.log.length) : null;
    res.send(populatedData);
    })
   })

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});