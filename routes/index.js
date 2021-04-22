var express = require('express');
var router = express.Router();
var multer = require('multer');
// var upload = multer({ dest: 'uploads/' })
var urlDB = 'mongodb+srv://admin:admin@cluster0.thl9q.mongodb.net/tinder';
const mongoose = require('mongoose');
mongoose.connect(urlDB, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("connected !!!");
});
var user = new mongoose.Schema({
  username: String,
  date: String,
  email: String,
  master_phone: String,
    sex: String,
    Description: String,
  avatar: String,
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/img/')
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname);
        cb(null,file.originalname);
    }
})

var upload = multer({

    dest: 'assets/img/'
    , storage: storage,
});

router.get('/', function (req, res, next) {
 res.render("home")
});

/* GET home page. */
router.get("/SignUP.html", function (request, response) {
  response.render("signUP");
});
router.get("/LogIn.html", function (request, response) {
  response.render("Login");
});
router.get("/index.html", function (request, response) {
  response.render("home");
});
let baseJson={
    errorCode: undefined,
    errorMessage:undefined,
    data:undefined,
}
router.get('/getUser', function (req, res, next) {
    var connectUsers = db.model('users', user);
    connectUsers.find({},
        function (error, users) {
            if (error){
                baseJson.errorCode = 400
                baseJson.errorMessage = error
                baseJson.data =[]
            }else {
                baseJson.errorCode = 200
                baseJson.errorCode = 'thanh cong'
                baseJson.data = users
            }
            res.send(baseJson);
        })
});

router.get('/user.hbs', function(req, res, next) {
  var connectUsers = db.model('users', user);
  connectUsers.find({}).lean().exec(
      function (error, users) {
        if (error) {
          res.render('user.hbs', {title: 'Express : Loi@@@@'})
        } else {
          res.render('user', {title: 'Express', users: users})
          console.log(users)
        }
      })
});

router.get('/:id/', function(req, res, next) {
    var connectUsers = db.model('users',user);
    connectUsers.findOne({_id: req.params.id},null,null, function (error,result) {
        if (error) {
            console.log(error)
        } else {
            res.render('update', {connectUsers:result});
        }
    })
});

router.post('/insertUsername',upload.single("avatar") ,function (req, res, next) {
  var connectUser = db.model("users", user);
  connectUser({
      // username: String,
      // date: String,
      // email: String,
      // master_phone: String,
      // sex: String,
      // Description: String,
      // avatar: String,
      username: req.body.username,
      date: req.body.date,
      email: req.body.address,
      master_phone: req.body.master_phone,
      sex: req.body.sex,
      Description: req.body.Description,
      avatar: req.file.originalname
  }).save(function (error) {
    if(error){
      res.render('user', { title: 'Express Loi' });
    }else{
      res.redirect('user.hbs');
    }
  });
});

router.post('/:id/edit', upload.single('avatar'), function (req, res) {
    var connectUsers = db.model('users', user);
    connectUsers.findByIdAndUpdate(req.params.id,
        {
            username: req.body.username,
            password: req.body.password,
            address: req.body.address,
            master_phone: req.body.master_phone,
            avatar: req.file.originalname
        }, function (error){
            if (error) {
                console.log(error)
            } else {
                res.redirect('/user.hbs')
            }
        });
})

router.post('/:id',upload.single('avatar'),function (req,res){
    var connectUsers = db.model('users',user);
    var run = connectUsers.findByIdAndRemove(req.params.id,null,function (error){
        if(error){
            res.render('user.hbs', { title: 'Express Loi' });
        }else{
            res.redirect('user.hbs');
        }
    })
})
module.exports = router;
