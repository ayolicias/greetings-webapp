const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const GreetRoute = require('./routes/greeted');
const GreetServices = require('./services/greets')
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

const greetServices = GreetServices(pool);
const  greetRoute = GreetRoute(greetServices);



app.engine('handlebars', exphbs({
  defaultLayout: 'main',
}))

app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(bodyParser.json())
app.use(express.static('public'));

app.get('/',greetRoute.greetUser);

 app.post('/greeting',greetRoute.greetUser)

app.get('/greeted',greetRoute.getAllUsers);

app.get('/reset',greetRoute.reset);
 


let PORT = process.env.PORT || 3009;
app.listen(PORT, function() {
  console.log("App started on Port", PORT);
});
