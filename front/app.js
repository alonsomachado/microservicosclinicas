const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');
const axios = require('axios');
const request = require('request'); 

let logado = false;  

// Create Redis Client
let client = redis.createClient(6379, "caduser.rediscaduser.default.svc.cluster.local");

client.on('connect', function(){
  console.log('Connected to Redis...');
});

const port = 30000;

const app = express();

// View Engine
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// methodOverride para funcionar o DELETE
app.use(methodOverride('_method'));

function checkIfLoggedIn(req,res,next) {
	next();
	return;
	//req.session.loggedin = false;
	/*var sessionId = req.cookies.session;
	//Cria Cookie de Sessao com variavel LoggedIn
	if (!sessionId || sessionId.search(/^[A-Fa-f0-9]+$/) == -1) {
		res.locals.loggedIn = false;
		next();
		return;
	}   */
	
};
app.use(checkIfLoggedIn);

// Search Page
app.get('/', function(req, res, next){
  res.render('searchusers');
});

app.get('/logar', function(req, res, next){
	logado = true;
	//req.session.loggedin = true;
	//res.locals.loggedIn = true;
  res.render('searchusers');
});

app.post('/user/search', function(req, res, next){
  let id = req.body.id;

  client.hgetall(id, function(err, obj){
    if(!obj){
      res.render('searchusers', {
        error: 'Usuario não encontrado'
      });
    } else {
      obj.id = id;
      res.render('details', {
        user: obj
      });
    }
  });
});

app.get('/user/todos', function(req, res, next){
 

  //let pong = client.keys('*');
  //res.render('listdetails', {   pong
  client.hgetall('*', function(err, obj){
	res.render('listdetails', {
        user: obj
    });
	/*
    if(!obj){
      res.render('searchusers', {
        error: 'Nenhum Usuario encontrado'
      });
    } else {
      res.render('listdetails', {
        user: obj
      });
    }
	*/
  });
});

app.get('/pagamento', function(req, res, next){
  res.render('addpagamento');
});

app.post('/pagamento', function(req, response, next){
	
	/*app.post("/api/pagamento", function(req, res);*/
	
	var options = {
        method: 'POST',
        url: '/api/pagamento',
    }
    request(options, function(err, response, body) {
        if (err) {
            return res.status(500).end();
        }
        res.send(body); // send whatever you want here
    });
	
	res.redirect('/api/pagamento');
});


app.get('/agendamento', function(req, res, next){
	var datahj = Date();
  res.render('addagendamento', { datahj  });
});

app.post('/agendamento', function(req, res, next){
	
	/*axios.post("/api/porto/agendamento", {
		  
		horarioInicio = req.body.horarioInicio,
		horarioTermino = req.body.horarioTermino,
		dia = req.body.dia,
		nome = req.body.nome,
		email  = req.body.email,
		medico  = req.body.medico
	})*/
	
	res.redirect('/');
});


app.get('/checkin', function(req, res, next){
	
	//res.render('addcheckin');
	
	axios
	.get("https://randomuser.me/api/?results=5")
    .then(response =>
      response.data.results.map(user => ({
        name: `${user.name.first} ${user.name.last}`,
        username: `${user.login.username}`,
        email: `${user.email}`,
        image: `${user.picture.thumbnail}`
      }))
    )
    .then(users => {    
	console.log(users);
	res.render('addcheckin', { users } ); 
	})
    .catch(error => this.setState({ error, isLoading: false }));
    
         
});

app.post('/checkin', function(req, res, next){
	
  
	/*axios.post("/api/checkin", {
		  
		idagendamento = req.body.idagendamento,
		notafiscal = req.body.notafiscal,
		valor = req.body.valor
		
	})*/
	
	res.redirect('/');
});


app.get('/user/add', function(req, res, next){
  res.render('adduser');
});

// Add User Post
app.post('/user/add', function(req, res, next){
  let id = req.body.id;
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let email = req.body.email;
  let phone = req.body.phone;
  
	//const ret = await axios.post(requestUrl, JSON.stringify(data));
  client.hmset(id, [
    'first_name', first_name,
    'last_name', last_name,
    'email', email,
    'phone', phone
  ], function(err, reply){
    if(err){
      console.log(err);
    }
    console.log(reply);
    res.redirect('/');
  });
});

// Delete User
app.delete('/user/delete/:id', function(req, res, next){
  client.del(req.params.id);
  res.redirect('/');
});

app.listen(port, function(){
  console.log('Server started on port '+port);
});
