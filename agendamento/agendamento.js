const express = require('express');
const app = express();
const redis = require('redis');

const publisher = redis.createClient(6379, "pubsub.redis.default.svc.cluster.local");

let clientporto = redis.createClient(6379, "cadagenporto.rediscadagenporto.default.svc.cluster.local");
let clientbraga = redis.createClient(6379, "cadagenbraga.rediscadagenbraga.default.svc.cluster.local");

app.use(express.json());

//Microservico Agendamento porta padrao 30123
const port = process.env.PORT || 30123

const agend =  [

{ id: 1, horarioInicio: '08:00', horarioTermino: '08:55', dia: '14/01/2020', nome: 'Teste1', email: 'joao@gmail.com', medico: 'Joao Pedro Cunha'},
{ id: 2, horarioInicio: '09:00', horarioTermino: '09:55', dia: '14/01/2020', nome: 'Teste2', email: 'joao@gmail.com', medico: 'Joao Pedro Cunha'},
{ id: 3, horarioInicio: '08:00', horarioTermino: '08:55', dia: '16/01/2020', nome: 'Teste3', email: 'joao@gmail.com', medico: 'Paula Tavares Guimaraes'},

];

const medico =  [
{ id: 1, nome: 'Joao Pedro Cunha', email: 'joaopc@gmail.com', especialidade: 'Pediatra'},
{ id: 2, nome: 'Manoel de Sa Carvalhal', email: 'manoelsc@gmail.com', especialidade: 'Clinico Geral'},
{ id: 3, nome: 'Pedro Afonso Melo Campos', email: 'pedroafm@gmail.com', especialidade: 'Oftamologista'},
{ id: 4, nome: 'Paula Tavares Guimaraes', email: 'paulatg@gmail.com', especialidade: 'Pediatra'},
{ id: 5, nome: 'Joana Guedes Dutra', email: 'joanagd@gmail.com', especialidade: 'Oftamologista'}
];

app.get('/api/braga/pagamentos', async (req, res) => {
	//res.send('Olá o microservico Pagamento esta Online em /braga/pagamento SEM  O /');
	const retorno = agend.map(c => c);
	if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	res.send(retorno);
});


app.get('/api/porto/pagamentos', async (req, res) => {
	//res.send('Olá o microservico Pagamento esta Online em /braga/pagamento SEM  O /');
	const retorno = agend.map(c => c);
	if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	res.send(retorno);
});

app.get('/api/braga/agendamento/:id', async (req, res) => {
	
	const retorno = agend.find(c => c.id === parseInt(req.params.id));
	if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	res.send(retorno);
});

app.get('/api/porto/agendamento/:id', async (req, res) => {
	
	const retorno = agend.find(c => c.id === parseInt(req.params.id));
	if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	res.send(retorno);
});

app.post('/api/braga/agendamento/', (req, res) => {
	
	const novo = {
		horarioInicio: req.body.horarioInicio,
		horarioTermino: req.body.horarioTermino,
		dia: req.body.dia,
		nome: req.body.nome,
		email: req.body.email,
		medico: req.body.medico
	}
	
	console.log(novo);
	agend.push(novo);
	publisher.publish("agendamento:braga",JSON.stringify(novo));
	console.log("Publicou no Redis Pub/Sub - agendamento:braga");
	res.send(novo);
});

app.post('/api/porto/pagamento/', async (req, res) => {
	
	const novo = {
		horarioInicio: req.body.horarioInicio,
		horarioTermino: req.body.horarioTermino,
		dia: req.body.dia,
		nome: req.body.nome,
		email: req.body.email,
		medico: req.body.medico
	}
	console.log(novo);
	agend.push(novo);
	publisher.publish("agendamento:porto",JSON.stringify(novo));
	console.log("Publicou no Redis Pub/Sub - agendamento:porto");
	res.send(novo);
});


app.listen(port, () => {
  console.log(`Agendamento na porta ${port}`)
});