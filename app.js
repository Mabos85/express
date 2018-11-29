const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const expressValidator = require("express-validator");

const app = express();



/*
const logger = function(req, res, next){
  console.log('logging...');
  next();
}

app.use*/

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

const users = [
  {
    id: 1,
    first_name: 'John',
    last_name: 'Smith',
    email: 'john@gmail.com'

  },
  {
    id: 2,
    first_name: 'bob',
    last_name: 'doe',
    email: 'john@gmail.com'

  },
  {
    id: 3,
    first_name: 'jill',
    last_name: 'jackson',
    email: 'john@gmail.com'

  }

]

app.get('/', function(req, res){
  res.render("index", {
    title: 'Customers',
    users: users
  });
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
      console.log('SUCCSESS');
  }



  console.log(newUser);

});

app.listen(3000, function(){
  console.log("Server started on 3000...")
});
