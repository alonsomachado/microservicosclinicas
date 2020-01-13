const express = require('express');
const app = express();
//Mongoose ODM mapeador objeto relacional de node.js para MONGO.DB 
const mongoose = require('mongoose');
const redis = require('redis');

const subscriber = redis.createClient(6379, pubsub.redis.default.svc.cluster.local);
const publisher = redis.createClient(6379, pubsub.redis.default.svc.cluster.local);

app.use(express.json());

//mongoose.connect({'', () => console.log('Conectou ao Banco de Dados'); });

//Microservico Realizar a consulta ou Exame (30123)
const port = process.env.PORT || 30123

const lista =  [
{ id: 1, agendamento: 'Teste1', valor: 20},
{ id: 2, agendamento: 'Teste1', valor: 20},
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

subscriber.subscribe("agendamento:braga");

app.get('/', async (req, res) => {
	
	res.send('Olá o microservico Pagamento esta Online em /');
});

app.get('/:id', async (req, res) => {
	res.send('ACESSOU GET ID PADRAO');
	//const retorno = pagamento.find(c => c.id === parseInt(req.params.id));
	//if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	//res.send(retorno);
});


app.get('/braga/realizar/:id', async (req, res) => {
	
	const retorno = lista.find(c => c.id === parseInt(req.params.id));
	if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	res.send(retorno);
});

app.get('/porto/realizar/:id', async (req, res) => {
	
	const retorno = lista.find(c => c.id === parseInt(req.params.id));
	if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	res.send(retorno);
});

app.post('/braga/realizar/', async (req, res) => {
	
	const novo = {
		id: lista.length + 1,
		valor: req.body.valor,
		agendamento: req.body.agendamento
	}
	lista.push(novo);
	console.log('Realiza salvo na Lista');
		
	publisher.publish("realiza:braga",JSON.stringify(novo))
	//console.log("Publicou no Redis Pub/Sub- realiza:braga");
	res.send(novo);
});

app.post('/porto/realizar/', async (req, res) => {
	
	const novo = {
		id: lista.length + 1,
		valor: req.body.valor,
		agendamento: req.body.agendamento
	}
	lista.push(novo);
	console.log('Realiza salvo na Lista');
		
	publisher.publish("realiza:porto",JSON.stringify(novo))
	//console.log("Publicou no Redis Pub/Sub- realiza:braga");
	res.send(novo);
});


app.listen(port, () => {
  console.log(`Pagamento na porta ${port}`)
});