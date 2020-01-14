const express = require('express');
const app = express(); 
const redis = require('redis');

const subscriber = redis.createClient(6379, "pubsub.redis.default.svc.cluster.local");
const publisher = redis.createClient(6379, "pubsub.redis.default.svc.cluster.local");

app.use(express.json());

//Microservico Realizar a consulta ou Exame (30123)
const port = process.env.PORT || 30123

const lista =  [
{ id: 1, idagendamento: 1, notafiscal: 731231, valor: 20},
{ id: 2, idagendamento: 2, notafiscal: 123123, valor: 20},
];

//Recebeu Mensagem do Redis (Publisher/Subscribe)
subscriber.on('message',(channel,message) => {
    try {
	  var agen = JSON.parse(message); 
	  var cidade = channel.substring(12);
	  console.log(cidade); //Aparecer objeto json
	  console.log(agen);
	} catch (ex) {
	  console.error(ex);
	}
})

subscriber.subscribe("agendamento:braga");
subscriber.subscribe("agendamento:porto");

app.get('/', async (req, res) => {
	
	res.send('Olá o microservico Pagamento esta Online em /');
});

app.get('/api/braga/realizar/:id', async (req, res) => {
	
	const retorno = lista.find(c => c.id === parseInt(req.params.id));
	if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	res.send(retorno);
});

app.get('/api/porto/realizar/:id', async (req, res) => {
	
	const retorno = lista.find(c => c.id === parseInt(req.params.id));
	if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	res.send(retorno);
});

app.post('/api/braga/realizar/', async (req, res) => {
	
	const novo = {
		id: lista.length + 1,
		idagendamento: req.body.idagendamento,
		notafiscal: req.body.notafiscal,
		valor: req.body.valor
	}
	lista.push(novo);
	console.log('Realiza salvo na Lista');
		
	publisher.publish("realiza:braga",JSON.stringify(novo));
	console.log("Publicou no Redis Pub/Sub- realiza:braga");
	res.send(novo);
});

app.post('/api/porto/realizar/', async (req, res) => {
	
	const novo = {
		id: lista.length + 1,
		idagendamento: req.body.idagendamento,
		notafiscal: req.body.notafiscal,
		valor: req.body.valor
	}
	lista.push(novo);
	console.log('Realiza salvo na Lista');
		
	publisher.publish("realiza:porto",JSON.stringify(novo));
	console.log("Publicou no Redis Pub/Sub- realiza:braga");
	res.send(novo);
});


app.listen(port, () => {
  console.log(`Realiza na porta ${port}`)
});