var express = require('express')
var app = express()
const logger = require('morgan')
const multer = require('multer')
const path = require('path')
var router = express.Router()
var bodyParser = require('body-parser')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
const https = require('https')
const querystring = require('querystring')
const userModel = require('./models/users_models')
const eventModel = require('./models/event_models')
const adminModel = require('./models/admin_models')
const registerModel = require('./models/register_models.js')
const mongoose = require('./config/database')
app.set('view engine', 'ejs') 
var session = require('express-session')
var cors = require('cors')
var methodOverride = require('method-override')
app.use(express.static(__dirname + '/public'))
var user_id
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
var swaggerUi = require('swagger-ui-express')
var swaggerDocument = require('./swagger.json');
  
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(session({
    key : 'user_id',
    secret: 'SimalSimal',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000
    }
}))
// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 10000000000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('create_acara.ejs', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('create_acara.ejs', {
          msg: 'Error: No File Selected!'
        });
      } else {
        res.render('create_acara.ejs', {
          msg: 'File Uploaded!',
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

app.post('/register',(req,res,next)=>{
  adminModel.create({ 
    email: req.body.email,
    name: req.body.name, 
    passwd1: req.body.passwd1 
  },(err, result)=> {
      if (err) 
       next(err)
      else{
       res.redirect('/list')
      }
    })
})

app.post('/registerEvent',(req,res,next)=>{
  registerModel.create({
    id_user : req.body.idUser,
    id_event : req.body.idEvent
  }),(err,result)=>{
    if(err)
      next(err)
    else{
    var response = "You are Registe to an event!"
    res.json(response)
    console.log(result)
    }
  }
})



app.post('/createEvent',(req,res,next)=>{
  eventModel.create({
    prodi : req.body.prodi,
    nama : req.body.nama,
    price : req.body.price,
    deskripsi : req.body.deskripsi,
    tanggalMulai : req.body.tanggalMulai,
    tanggalSelesai : req.body.tanggalSelesai,
    waktuMulai : req.body.waktuMulai,
    waktuSelesai : req.body.waktuSelesai,
    poster : req.body.poster,
    latLng : req.body.latLng,
    lokasi : req.body.lokasi
  },(err,result)=>{
    if(err)
      next(err)
    else{
      var options = {
        hostname: 'onesignal.com',
        path: '/api/v1/notifications',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic OGVlZWNjMjctZDc2ZC00YTE2LTk3YTAtZDk3ZTYxNjM5ZjUz'
        }
      };
      var postData = JSON.stringify({
        "app_id": "fe379b5b-59b5-4059-83ef-9553898c4a9a", 
        "included_segments": ["All"], 
        "contents": {"en": result.deskripsi}, 
        "headings":  {"en": "(New Event) VentUMN - " + result.nama}
      });
      var req = https.request(options, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', (d) => {
          process.stdout.write(d);
        });
      });

      req.on('error', (e) => {
        console.error(e);
      });

      req.write(postData);
      req.end();
      res.redirect('/dashHimti')
    }
  })
})

app.post('/signUp',(req,res,next)=>{

  userModel.create({ 
    email: req.body.email,
    name: req.body.name, 
    tanggalLahir : req.body.tanggalLahir,
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
app.post('/checkLogin',(req,res,next)=>{
userModel.findOne({email:req.body.email},(err, userInfo)=>{
    if(!userInfo){
      res.status(401).send({message:'Sorry, no one\'s!'})
      console.log('no one find!')
    }else{
    if(bcrypt.compareSync(req.body.passwd1, userInfo.passwd1)) {
   req.session.user_id = userInfo._id
    var response = userInfo._id
    console.log(response)
    res.json(response)
    }
  }
    })
})
app.get('/getData',(req,res)=>{
  eventModel.find({},(err, result)=>{
    res.json(result)
})
})

app.get('/getUserData/:id',(req,res)=>{
  userModel.findOne({_id:req.params.id},(err,result)=>{
    res.json(result)
  })
})

app.get('/getOneData/:id'  ,(req,res)=>{
  eventModel.findOne({_id : req.params.id},(err,eventInfo)=>{
    if(!eventInfo){
      res.json('Not found!')
    }else{
      var response = eventInfo
      console.log(response)
      res.json(response)
    }
  })
})



app.post('/login',(req,res,next)=>{
  adminModel.findOne({email:req.body.email},(err, userInfo)=>{
    if(!userInfo){
      console.log('user not found!')
      res.redirect('/')
    }else{
    if(req.body.email == "admin@admin.com"){
    if(bcrypt.compareSync(req.body.passwd1, userInfo.passwd1)) {
   req.session.user_id = userInfo._id
    console.log(req.session.user_id)
    console.log('you have LogIn as admin!')
    res.redirect('/list')
    }else{  
      console.log('your password is wrong!')
      res.redirect('/')
      }}else{
    if(req.body.email == "himti@himti.com"){
    if(bcrypt.compareSync(req.body.passwd1, userInfo.passwd1)) {
    req.session.user_id = userInfo._id
    console.log(req.session.user_id)
    console.log('you have LogIn as Himti!')
    res.redirect('/dashHimti')
    }else{  
      console.log('your password is wrong!')
      res.redirect('/')
      }
  }
    }}})
})

app.post('/updateuser/:id',checkAuth,(req,res,params)=>{
  res.render('update.ejs',{test:req.params.id})
})

app.post('/update/:id',(req,res)=>{
  if(req.body.email != ""){
    if(req.body.name != ""){
      if(req.body.passwd1 != ""){
        bcrypt.genSalt(10,(err,salt)=>{
          if(err) return next(err)
          bcrypt.hash(req.body.passwd1, salt, (err,hash)=>{
            if(err) return next(err)
            req.body.passwd1 = hash
            adminModel.updateOne({_id:req.params.id},{
              email: req.body.email,
              name :  req.body.name,
              passwd1 : req.body.passwd1
            },(err,result)=>{
          console.log('updated!')
          res.redirect('/list')
  })
})
        })
  }
  else{
    console.log("passwd isn't null")
    res.redirect('/create')
  }
}
  else{
    console.log("Name isn't NULL")
    res.redirect('/create')
  }
}
else{
  console.log("Email isn't NULL")
  res.redirect('/create')
  }
})

app.post('/delete/:id', (req, res)=>{
  adminModel.findByIdAndRemove({_id: req.params.id},(err, req)=>{
    if(err){ 
      console.log(err)
    }
    else {
      res.redirect('/list')
  }
  })
})


function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    res.redirect('/')
  } else {
    next()
  }
}
app.get('/',(req,res)=>{
   res.render('login.ejs')
})

app.get('/dashHimti',checkAuth,(err,res)=>{
  eventModel.find({},(err, result)=>{
  res.render('dashboard_himti.ejs',{event:result})
})
})
app.get('/dashBem',checkAuth,(err,res)=>{
  eventModel.find({},(err, result)=>{
  res.render('dashboard_utama_bem.ejs',{event:result})
})
})
app.get('/dashUtama',checkAuth,(err,res)=>{
  eventModel.find({},(err, result)=>{
  res.render('dashboard_utama_himti.ejs',{event:result})
})
})

app.get('/list',checkAuth,(err,res)=>{
  adminModel.find({},(err, result)=>{
  res.render('list.ejs',{admin:result})
})
})
app.get('/daftar',checkAuth,(err,res)=>{
  res.render('register.ejs')
})
app.get('/createAcara',checkAuth,(err,res)=>{
  res.render('create_acara.ejs')
})

app.get('/logout',(req,res)=>{
  delete req.session.user_id
  console.log('you have log out')
  res.redirect('/')
})

app.listen(process.env.PORT || 8080);
