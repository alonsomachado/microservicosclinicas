const express = require('express');
const app = express();
const redis = require('redis');

const subscriber = redis.createClient(6379, "pubsub.redis.default.svc.cluster.local");

let clientpag = redis.createClient(6379, "cadpag.rediscadpag.default.svc.cluster.local");

app.use(express.json());

//Microservico Pagamento (30123)
const port = process.env.PORT || 30123

const pagamento =  [
{ id: 0, idatendimento: 0, name: 'Teste', nif: '123123', pagamento: 20},

];

const notafiscal =   [
{ id: 0, idagendamento: 0, name: 'Teste', utente: '111000222', valor: 20},

];

//Recebeu Mensagem do Redis (Publisher/Subscribe)
subscriber.on('message',(channel,message) => {
    //console.log('Recebeu dados'+ channel +":"+message);
	try {
	  var nota = JSON.parse(message); 
	  //var cidade = channel.substring(8);
	  //console.log(cidade); //Aparecer objeto json
	  console.log(nota);
	  notafiscal.push(nota);
	} catch (ex) {
	  console.error(ex);
	}
})

subscriber.subscribe("checkin");

app.get('/', async (req, res) => {
	
	res.send('Olá o microservico Pagamento esta Online em /');
});

//Verifica se esta salvando o que recebeu do Message Broker PUBSUB em memoria para processar
app.get('/api/pagamento/checkin', async (req, res) => {

	const retorno = notafiscal.map(c => c);
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