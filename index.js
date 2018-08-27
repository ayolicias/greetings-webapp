const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const Greetings = require('./greetings');
const app = express();
const flash = require('express-flash');
const session = require('express-session');
const pg = require('pg');
const Pool = pg.Pool;

app.use(flash());

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/greeted_app_database';

const pool = new Pool({
  connectionString,
  ssl: useSSL
});

app.use(session({
  secret: "<Enter Name>",
  resave: false,
  saveUninitialized: true
}));

const greet = Greetings();

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
}))

app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(bodyParser.json())
app.use(express.static('public'));

app.get('/', function(req, res) {
  let counter = greet.getcount();
  // let greets = greet.greetingFunction();
  let greets = greet.getGreeting();

  res.render('home', {
    counter,
    greets

  });
});
app.get('/greeted', async function(req, res){
  try{
    let keep = await pool.query('select * from users');
    let database = keep.rows;
    res.render('greeted', {database});
  }
  catch(err){
    res.send(err.stack);
  }
})


app.post('/greeting', function(req, res) {

  let name = req.body.inputName;
  let language = req.body.language;

  // if inputName !== ''&& language !undefined){
  //   let user = await.Pool.query('select * from users WHERE users_greeted = $1', [name]);
  //   if (user.rows.lenghth === 0){
  //     Pool.query ('insert into users_greeted,user_language,counter')
  //   }
  // }

  if (language === undefined || name === "") {
    req.flash('info', 'Enter Name');

  } else {
    greet.greetingFunction(language, name)
  }

  console.log(greet.greetMe(language, name));
  res.redirect('/');
});

app.get('/reset', function(req, res) {
  greet.reset();
  res.redirect('/');
});

let PORT = process.env.PORT || 3009;
app.listen(PORT, function() {
  console.log("App started on Port", PORT);
});
