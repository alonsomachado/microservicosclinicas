const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');
const axios = require('axios');
const request = require('request'); 

let logado = false;  
console.log("Logado: "+logado);

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

//Cria Cookie de Sessao com variavel LoggedIn
function checkIfLoggedIn(req,res,next) {
	next();
	return;
	//Metodo 1
	//req.session.loggedin = false;
	
	//Metodo 2
	/*var sessionId = req.cookies.session;
	if (!sessionId || sessionId.search(/^[A-Fa-f0-9]+$/) == -1) {
		res.locals.loggedIn = false;
		next();
		return;
	}   */
	
};
app.use(checkIfLoggedIn);

// Search Page
app.get('/', function(req, res, next){
  res.render('searchusers', { logado });
});

app.get('/logar', function(req, res, next){
	logado = true;
	console.log("Logado: "+logado);
	
	//req.session.loggedin = true;
	//res.locals.loggedIn = true;
  //res.render('searchusers');
  res.redirect('/');
});

app.get('/logout', function(req, res, next){
	logado = false;
	console.log("Logado: "+logado);
	
  res.redirect('/');
});

app.post('/user/search', function(req, res, next){
  let id = req.body.id;

  client.hgetall(id, function(err, obj){
    if(!obj){
      res.render('searchusers', {
        error: 'Usuario não encontrado',
		logado
      });
    } else {
      obj.id = id;
      res.render('details', {
        user: obj,
		logado
      });
    }
  });
});

app.get('/user/todos', function(req, res, next){
 

  //let pong = client.keys('*');
  //res.render('listdetails', {   pong
  client.hgetall('*', function(err, obj){
	res.render('listdetails', {
        user: obj,
		logado
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
  res.render('addpagamento', { logado });
});

app.post('/pagamento', function(req, response, next){
	
	let name = req.body.name;
	let nif = req.body.nif;
	let pagamento = req.body.pagamento;
	let idatendimento = (req.body.idatendimento) ? req.body.idatendimento : "0" ;
	
	
	axios
	.post("http://192.168.99.111/api/pagamento", {
		  
		name: name,
		nif: nif,
		pagamento: pagamento,
		idatendimento: idatendimento

	})
	
	res.redirect('/');
});


app.get('/agendamento', function(req, res, next){
	//Formatando a data de hoje para validacao
	var vdatahj = new Date();
    var stmonth = new String();
    if( (vdatahj.getMonth()+1) < 10){
		stmonth = "0"+(vdatahj.getMonth()+1);
	}else{ 
	    stmonth = (vdatahj.getMonth()+1);
	}
	var stringdatahj = vdatahj.getFullYear()+"-"+stmonth+"-"+vdatahj.getDate();
  res.render('addagendamento', { datahj: stringdatahj, logado  });
});

app.post('/agendamento', function(req, res, next){
	
	let horarioInicio = req.body.horarioInicio;
	let horarioTermino = req.body.horarioTermino;
	let dia = req.body.dia;
	let nome = req.body.nome;
	let email  = req.body.email;
	let medico  = req.body.medico;
	
	axios
	.post("http://192.168.99.111/api/agendamento", {
		  
		horarioInicio: horarioInicio,
		horarioTermino: horarioTermino,
		dia: dia,
		nome: nome,
		email: email,
		medico: medico
	})
	/*.then(response =>
      response.data.results.map(user => ({
        name: `${user.name.first} ${user.name.last}`,
        username: `${user.login.username}`,
        email: `${user.email}`,
        image: `${user.picture.thumbnail}`
      }))
    )
    .then(users => {    
	console.log(users);
	res.render('/', { users, logado } ); 
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
	res.render('addcheckin', { users, logado } ); 
	})
    .catch(error => this.setState({ error, isLoading: false }));
    
         
});

app.get('/pagamentos/todos', function(req, res, next){
	
	// http://192.168.99.111/api/pagamento/lista
	axios
	.get("http://192.168.99.111/api/pagamento/lista")
    .then(response =>
      response.data.map(pag => ({
		id: `${pag.id}`,
		idatendimento: `${pag.idatendimento}`,
		name: `${pag.name}`,
		nif: `${pag.nif}`,
		pagamento: `${pag.pagamento}`
      }))
    )
    .then(pags => {    
	console.log(pags);
	res.render('listdetails', { pags, logado } ); 
	})
    .catch(error => console.log(error));
    
         
});

app.get('/agendamentos/todos', function(req, res, next){

	//http://192.168.99.111/api/agendamento/lista
	axios
	.get("http://192.168.99.111/api/agendamento/lista")
    .then(response =>
      response.data.map(agend => ({
		id: `${agend.id}`,
		horarioInicio: `${agend.horarioInicio}`,
		horarioTermino: `${agend.horarioTermino}`,
		dia: `${agend.dia}`,
		nome: `${agend.nome}`,
		email: `${agend.email}`,
		medico: `${agend.medico}`
      }))
    )
    .then(agends => {    
	console.log(agends);
	res.render('listdetails', { agends, logado } ); 
	})
    .catch(error => console.log(error) );
    
         
});

app.get('/externo/todos', function(req, res, next){
	
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
	res.render('listdetails', { users, logado } ); 
	})
    .catch(error => this.setState({ error, isLoading: false }));
    
         
});

app.post('/checkin', function(req, res, next){
	
	
	let idagendamento = req.body.idagendamento;
	let name = req.body.name;
	let utente = req.body.utente;
	let valor = req.body.valor;
	
	axios
	.post("http://192.168.99.111/api/checkin", {
		  
		idagendamento: idagendamento,
		name: name,
		utente: utente,
		valor: valor
	})
	
	res.redirect('/');
});


app.get('/user/add', function(req, res, next){
  res.render('adduser', { logado });
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
