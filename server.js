var express = require('express')
var app = express()
const logger = require('morgan')
var router = express.Router()
var bodyParser = require('body-parser')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
const userModel = require('./models/users_models')
const eventModel = require('./models/event_models')
const mongoose = require('./config/database')
app.set('view engine', 'ejs') 
var session = require('express-session')
var cors = require('cors')
var methodOverride = require('method-override')
app.use(express.static(__dirname + '/public'))
var user_id
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());
var swaggerUi = require('swagger-ui-express')
	swaggerDocument = require('./swagger.json');
	
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(session({
    key : 'user_id',
    secret: 'SimalSimal',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000
    }
}))


app.post('/signUp',(req,res,next)=>{

  userModel.create({ 
    email: req.body.email,
  	name: req.body.name, 
  	passwd1: req.body.passwd1 
  },(err, result)=> {
      if (err) 
       next(err)
      else{
      var response = "You are Registered!"
      res.json(response)
      console.log(result)
      }
    })
})
app.get('/signUp/:email/:name/:passwd1',(req,res,next)=>{
  userModel.create({ 
    email: req.params.email,
    name: req.params.name, 
    passwd1: req.params.passwd1 
  },(err, result)=> {
      if (err) 
       next(err)
      else{
      var response = "You are Registered!"
      res.json(response)
      }
    })
})



app.post('/checkLogin',(req,res,next)=>{
  userModel.findOne({email:req.body.email},(err, userInfo)=>{
    if(!userInfo){
      res.status(401).send({message:'Sorry, no one\'s!'})
    }else{
    req.session.user_id = userInfo._id
    var response = "You are Log in!"
    res.json(response)
      }
  })
    })



app.get('/checkLogin/:email/:passwd1', (req, res)=>{
  console.log(req.params.email)
  console.log(req.params.passwd1)
  userModel.findOne({email:req.params.email},(err, userInfo)=>{
    if(!userInfo){
      res.status(401).send({message:'Sorry, no one\'s!'})
      console.log('no one find!')
    }else{
    if(bcrypt.compareSync(req.params.passwd1, userInfo.passwd1)) {
   req.session.user_id = userInfo._id
    
    res.json('registered')
    }else{
    console.log('your password is wrong!')
      }
  }
    })
})

app.get('/getData',(req,res)=>{
  eventModel.find({},(err, result)=>{
    res.json(result)
})
})

function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    res.status(401).send({message:'you are not fucking me anymore'})
  } else {
    next()
  }
}

app.listen(process.env.PORT || 8080);