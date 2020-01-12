const express = require('express');
const app = express();
//Mongoose ODM mapeador objeto relacional de node.js para MONGO.DB 
const mongoose = require('mongoose');

const redis = require('redis');

const publisher = redis.createClient();


app.use(express.json());

// https://alligator.io/nodejs/express-basics/
// https://alligator.io/nodejs/crud-operations-mongoose-mongodb-atlas/

//https://expressjs.com/en/4x/api.html#router e https://expressjs.com/en/guide/routing.html


//Setar os BDs do Atlas no YAML em alguma variavel de ambiente para reutilizar a mesma imagem
// mongodb+srv://testemongodb:modbMAdTU3sjEqns@cluster0-pmvdk.mongodb.net/test?retryWrites=true&w=majority //Braga
// mongodb+srv://testemongodb:modbMAdTU3sjEqns@testandomongodb-pklgf.mongodb.net/test?retryWrites=true&w=majority //Porto
const bdcon = process.env.BD_URL || "mongodb+srv://testemongodb:modbMAdTU3sjEqns@cluster0-pmvdk.mongodb.net/test?retryWrites=true&w=majority"

mongoose.connect(bdcon, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
//User do BD: testemongodb e Senha do BD: modbMAdTU3sjEqns

require('./agendamento');
//Constante que vai ser o acesso a esta tabela
const Agendamento = mongoose.model('Agendamento');

const medico =  [
{ id: 1, name: 'Joao Pedro Cunha', email: 'joaopc@gmail.com'},
{ id: 2, name: 'Manoel de Sa Carvalhal', email: 'manoelsc@gmail.com'},
{ id: 3, name: 'Pedro Afonso Melo Campos', email: 'pedroafm@gmail.com'},
{ id: 4, name: 'Paula Tavares Guimaraes', email: 'paulatg@gmail.com'}
];

//Health Check
//app.get('/api/', (req, res) => {
//	res.send('Olá o microservico Agendamento esta Online');
//});

app.get('/', async (req, res) => {
	res.status(200);
	//res.send('Olá o microservico Agendamento esta Online');
});

//Lista todos os Agendamentos Marcados
app.get('/api/agendamentos', (req, res) => {
	Agendamento.find().then( (agendamentos) => {
		res.json(agendamentos);
	});
});

//Escolhe Aquele Elemento entre os Agendamentos Marcados
app.get('/api/agendamento/:id', (req, res) => {
	
	Agendamento.findById(req.params.id).then( (agendamento) => {
		if(!agendamento) res.send('Nao existe na lista com o ID especificado');
		res.json(agendamento);
	});
});

//Para DELETAR Agendamento.findbyIdAndRemove(req.params.id).then();

//Cria um novo agendamento por POST
app.post('/api/agendamento/:id', (req, res) => {
	
	const novo = {
		horarioInicio: req.body.horarioInicio,
		horarioTermino: req.body.horarioTermino,
		dia: req.body.dia,
		nome: req.body.nome,
		email: req.body.email
	}
	
	publisher.publish("agendamento-notify",JSON.stringify(novo))
    //console.log("Publicou no Redis - agendamento-notify");
	
	//Cria o agendamento na tabela do MongoDb com Mongoose
	var agendar = new Agendamento(novo)
	const salvo = agendar.save();
	console.log('Agendamento novo salvo no BD');
	res.send(salvo);
});

//Microservico Agendamento Default 30123
const port = process.env.PORT || 30123

app.listen(port, () => console.log('Agendamentos na porta %s!', port));