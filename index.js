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

app.get('/', async function(req, res) {
let counter = greet.getcount();
 let greets = greet.getGreeting();
 let current = await pool.query('select count(*) from users');
 let count= current.rows[0].current;
  res.render('home', {
    counter,
    greets

  });
});

app.post('/greeting',async function(req, res) {

  let name = req.body.inputName;
  let language = req.body.language;
  greet.greetingFunction(language, name);

  if (name === "" && language === undefined) {
    req.flash("entryOne", 'Enter name & Select Language')
  }

  else if (name ==='' || name === undefined) {
    req.flash("entryTwo", 'Enter name')
  }
  else if (language ===''|| language === undefined) {
    req.flash("entryThree", 'select language')
  }

  else{

  let user = await pool.query('select * from users where users_greeted = $1', [name,]);
  if(user.rows.length != 0){

    let currentCounter = await pool.query('select counter from users where users_greeted = $1',[name]);
     let increment = currentCounter.rows[0].counter +1;

     await pool.query('update users set counter =$1,user_language=$2 where users_greeted =$3',[increment,language, name,]);
  }
  else{
    await pool.query('insert into users (users_greeted, user_language, counter) values ($1,$2,$3)',[name,language,1])

  }
}

  res.redirect('/');
});

app.get('/greeted', async function(req, res,){
  try{
    let keep = await pool.query('select * from users');
    let database = keep.rows;

    res.render('greeted', {database});
  }
  catch(err){
  }
});

app.get('/reset', async function(req, res) {
  greet.reset();
  await pool.query('Delete from users');
  res.redirect('/');
});


let PORT = process.env.PORT || 3009;
app.listen(PORT, function() {
  console.log("App started on Port", PORT);
});
