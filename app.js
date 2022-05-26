//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res){
  res.render("home");
});
app.get("/login", function(req,res){
  res.render("login");
});
app.get("/register", function(req,res){
  res.render("register");
});

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema(
  {
    username: String,
    password: String
  }
);

const secret = "Thisisourlittlesecret.";
mongoose.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});

const User = mongoose.model("User",userSchema);

app.post("/register", function(req,res){
  const newUser = new User({
    username: req.body.username,
    password: req.body.password
  });

  newUser.save((err)=>{
    if(!err){
      res.send("Succesfully added user.");
    }else{
      res.send(err);
    }
  });
});

app.post("/login", function(req,res){

    User.findOne({username: req.body.username},function(err,foundUser){
        if (!err){
          if(foundUser.password === req.body.password ){
            res.send("Succesfully logged in.");
          }else{
            res.send("Wrong password. Please retry.");
          }
        }else{
          res.send(err);
        }
    }
    );
});








app.listen(3000, function(err){
  if(!err){
    console.log("Server started on port 3000.");
  }else{
    console.log(err);
  }
});
