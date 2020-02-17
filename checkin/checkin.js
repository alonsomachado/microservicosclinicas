const express = require('express');
const app = express(); 
const redis = require('redis');

const subscriber = redis.createClient(6379, "pubsub.redis.default.svc.cluster.local");
const publisher = redis.createClient(6379, "pubsub.redis.default.svc.cluster.local");

let clientcheckin = redis.createClient(6379, "cadcheckin.rediscadcheckin.default.svc.cluster.local");

app.use(express.json());

//Microservico Realizar a consulta ou Exame (30123)
const port = process.env.PORT || 30123

const agend =  [

{ id: 0, horarioInicio: '00:00', horarioTermino: '00:55', dia: '14/02/2020', nome: 'Teste', email: 'a@gmail.com', medico: 'Joao Pedro Cunha'},

];

const lista =  [
{ id: 1, idagendamento: 1, notafiscal: 731231, valor: 20},
{ id: 2, idagendamento: 2, notafiscal: 123123, valor: 20},
];

//Recebeu Mensagem do Redis (Publisher/Subscribe)
subscriber.on('message',(channel,message) => {
    try {
	  var agen = JSON.parse(message); 
	  console.log(agen);
	  agend.push(agen);
	} catch (ex) {
	  console.error(ex);
	}
})

subscriber.subscribe("agendamento");

app.get('/api/checkin/vivo', async (req, res) => {
	
	res.send('Olá o microservico Checkin esta Online em /checkin/');
});

app.get('/api/checkin/lista', async (req, res) => {
	const retorno = lista.map(c => c);
	if(!retorno) res.status(404).send('Nao existe lista de Check-in');
	res.send(retorno);
});

app.get('/api/checkin/agendamentosrecebidos', async (req, res) => {
	const retorno = agend.map(c => c);
	if(!retorno) res.status(404).send('Nao existe Agendamentos recebidos por Check-in');
	res.send(retorno);
});

app.get('/api/checkin/:id', async (req, res) => {
	
	const retorno = lista.find(c => c.id === parseInt(req.params.id));
	if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	res.send(retorno);
});

app.post('/api/checkin/', async (req, res) => {
	
	const novo = {
		id: lista.length + 1,
		idagendamento: req.body.idagendamento,
		notafiscal: req.body.notafiscal,
		valor: req.body.valor
	}
	lista.push(novo);
	console.log('Realiza salvo na Lista');
		
	publisher.publish("checkin",JSON.stringify(novo));
	console.log("Publicou no Redis Pub/Sub- checkin");
	res.send(novo);
});

app.listen(port, () => {
  console.log(`Realiza na porta ${port}`)
});