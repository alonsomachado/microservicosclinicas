const express = require('express');
const app = express();
//Mongoose ODM mapeador objeto relacional de node.js para MONGO.DB 
const mongoose = require('mongoose');
const redis = require('redis');

const subscriber = redis.createClient(6379, pubsub.redis.default.svc.cluster.local);

app.use(express.json());

//mongoose.connect({'', () => console.log('Conectou ao Banco de Dados'); });

//Microservico Pagamento (30123)
const port = process.env.PORT || 30123

const pagamento =  [
{ id: 1, name: 'Teste1', email: 'joao@gmail.com', pagamento: 20},
{ id: 2, name: 'Teste2', email: 'elll2@gmail.com', pagamento: 15},
];

//Recebeu Mensagem do Redis (Publisher/Subscribe)
subscriber.on('message',(channel,message) => {
    console.log('Recebeu dados ${channel}:'+message);
	try {
	  var agen = JSON.parse(message); 
	  console.log(agen); //Aparecer objeto json
	} catch (ex) {
	  console.error(ex);
	}
})

subscriber.subscribe("realiza:braga");
//subscriber.subscribe("realiza:porto");

app.get('/', async (req, res) => {
	
	res.send('Olá o microservico Pagamento esta Online em /');
});

app.get('/:id', async (req, res) => {
	res.send('ACESSOU GET ID PADRAO');
	//const retorno = pagamento.find(c => c.id === parseInt(req.params.id));
	//if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	//res.send(retorno);
});

app.get('/braga/pagamento', async (req, res) => {
	res.send('Olá o microservico Pagamento esta Online em /braga/pagamento SEM  O /');
	//const retorno = pagamento.find();
	//if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	//res.send(retorno);
});

app.get('/braga/pagamento/', async (req, res) => {
	res.send('Olá o microservico Pagamento esta Online em /braga/pagamento/ !!!');
	//const retorno = pagamento.find();
	//if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	//res.send(retorno);
});

app.get('/braga/pagamento/:id', async (req, res) => {
	
	const retorno = pagamento.find(c => c.id === parseInt(req.params.id));
	if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	res.send(retorno);
});

app.get('/porto/pagamento/:id', async (req, res) => {
	
	const retorno = pagamento.find(c => c.id === parseInt(req.params.id));
	if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	res.send(retorno);
});

app.post('/braga/pagamento/', async (req, res) => {
	
	const novo = {
		id: pagamento.length + 1,
		name: req.body.name,
		email: req.body.email,
		pagamento: req.body.pagamento
	}
	pagamento.push(novo);
	res.send(novo);
});

app.post('/porto/pagamento/', async (req, res) => {
	
	const novo = {
		id: pagamento.length + 1,
		name: req.body.name,
		email: req.body.email,
		pagamento: req.body.pagamento
	}
	pagamento.push(novo);
	res.send(novo);
});


app.listen(port, () => {
  console.log(`Pagamento na porta ${port}`)
});