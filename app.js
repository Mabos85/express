const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const expressValidator = require("express-validator");
const mongojs = require("mongojs");
var db = mongojs('customerapp', ['users'])
const ObjectId = mongojs.ObjectId;

const app = express();





// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set static path
app.use(express.static(path.join(__dirname, 'public')));

// global Vars
app.use(function(req,res,next){
    res.locals.errors = null;
    next();
});

// Express validator Middelware
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return{
      param: formParam,
      msg: msg,
      value: value
    };

  }
}));


app.get('/', function(req, res){
  // find everything
db.users.find(function (err, docs) {
	// docs is an array of all the documents in mycollection
      // console.log(docs);
      res.render("index", {
      title: 'Customers',
      users: docs
  });
})


});

app.post('/user/add', function(req, res) {

  req.checkBody('first_name', 'first name is required').notEmpty();
  req.checkBody('last_name', 'last name is required').notEmpty();
  req.checkBody('email', 'email name is required').isEmail();

  const errors = req.validationErrors();
  if(errors){
      res.render("index", {
      title: 'Customers',
      users: users,
      errors: errors
    });
  } else {
    var newUser = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email
    }
      db.users.insert(newUser, function(err, result){
        if(err){
          console.log(err)
        }
        res.redirect('/');
      });
  }

});
app.delete('/users/delete/:id', function(req, res){
 db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
   if(err){
     conosle.log(err);
   }
   res.redirect('/')
 });
});
app.listen(3000, function(){
  console.log("Server started on port 3000...")
});
