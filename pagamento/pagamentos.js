const express = require('express');
const app = express();
const redis = require('redis');

const subscriber = redis.createClient(6379, "pubsub.redis.default.svc.cluster.local");

let clientpag = redis.createClient(6379, "cadpag.rediscadpag.default.svc.cluster.local");

app.use(express.json());

//Microservico Pagamento (30123)
const port = process.env.PORT || 30123

const pagamento =  [
{ id: 1, name: 'Teste1', nif: '123123', pagamento: 20},
{ id: 2, name: 'Teste2', nif: '1451234', pagamento: 15},
];

const notas =   [
{ id: 1, name: 'Teste1', email: 'joao@gmail.com', valor: 20},
{ id: 2, name: 'Teste2', email: 'elll2@gmail.com', valor: 15},
];

//Recebeu Mensagem do Redis (Publisher/Subscribe)
subscriber.on('message',(channel,message) => {
    //console.log('Recebeu dados'+ channel +":"+message);
	try {
	  var nota = JSON.parse(message); 
	  var cidade = channel.substring(8);
	  console.log(cidade); //Aparecer objeto json
	  console.log(nota);
	  notas.push(nota);
	} catch (ex) {
	  console.error(ex);
	}
})

subscriber.subscribe("checkin");

app.get('/', async (req, res) => {
	
	res.send('Olá o microservico Pagamento esta Online em /');
});

//Verifica se esta salvando o que recebeu do Message Broker PUBSUB em memoria para processar
app.get('/api/pagamento/notas', async (req, res) => {

	const retorno = notas.map(c => c);
	if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	res.send(retorno);
});

app.get('/api/pagamento/lista', async (req, res) => {

	const retorno = pagamento.map(c => c);
	if(!retorno) res.status(404).send('Nao existe Pagamentos na lista');
	res.send(retorno);
});

app.get('/api/pagamento/:id', async (req, res) => {
	
	const retorno = pagamento.find(c => c.id === parseInt(req.params.id));
	if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	res.send(retorno);
});

app.post('/api/pagamento/', async (req, res) => {
	
	const novo = {
		id: pagamento.length + 1,
		name: req.body.name,
		nif: req.body.nif,
		pagamento: req.body.pagamento
	}
	console.log(novo);
	pagamento.push(novo);
	res.send(novo);
});

app.listen(port, () => {
  console.log(`Pagamento na porta ${port}`)
});