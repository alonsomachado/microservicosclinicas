const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');
const axios = require('axios');

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

// Search Page
app.get('/', function(req, res, next){
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

app.get('/braga/pagamento', function(req, res, next){
  res.render('addpagamentob');
});

app.post('/braga/pagamento', function(req, res, next){
	
	axios.post("/api/braga/pagamento", {
		  
		name = req.body.name,
		nif = req.body.nif,
		pagamento = req.body.pagamento
	}
	
	res.redirect('/');
});

app.get('/porto/pagamento', function(req, res, next){
  res.render('addpagamentop');
});

app.post('/porto/pagamento', function(req, res, next){
	
	axios.post("/api/porto/pagamento", {
		  
		name = req.body.name,
		nif = req.body.nif,
		pagamento = req.body.pagamento
	}
	
	res.redirect('/');
});

app.get('/porto/agendamento', function(req, res, next){
  res.render('addagendamentop');
});

app.post('/porto/agendamento', function(req, res, next){
	
	axios.post("/api/porto/agendamento", {
		  
		horarioInicio = req.body.horarioInicio,
		horarioTermino = req.body.horarioTermino,
		dia = req.body.dia,
		nome = req.body.nome,
		email  = req.body.email,
		medico  = req.body.medico
	}
	
	res.redirect('/');
});

app.get('/braga/agendamento', function(req, res, next){
  res.render('addagendamentob');
});

app.post('/braga/agendamento', function(req, res, next){
	
	axios.post("/api/braga/agendamento", {
		  
		horarioInicio = req.body.horarioInicio,
		horarioTermino = req.body.horarioTermino,
		dia = req.body.dia,
		nome = req.body.nome,
		email  = req.body.email,
		medico  = req.body.medico
	}
	
	res.redirect('/');
});

app.get('/porto/realizar', function(req, res, next){
  res.render('addagendamentop');
});

app.post('/porto/realizar', function(req, res, next){
	
  
	axios.post("/api/porto/realizar", {
		  
		idagendamento = req.body.idagendamento,
		notafiscal = req.body.notafiscal,
		valor = req.body.valor
		
	}
	
	res.redirect('/');
});


app.get('/braga/realizar', function(req, res, next){
  res.render('addagendamentob');
});

app.post('/braga/realizar', function(req, res, next){
	
  
	axios.post("/api/braga/realizar", {
		  
		idagendamento = req.body.idagendamento,
		notafiscal = req.body.notafiscal,
		valor = req.body.valor
		
	}
	
	res.redirect('/');
});



app.get('/braga', function(req, res, next){
  res.render('braga');
});

app.get('/porto', function(req, res, next){
  res.render('porto');
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
