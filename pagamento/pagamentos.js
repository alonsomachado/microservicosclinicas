const express = require('express');
const app = express();
const redis = require('redis');

const subscriber = redis.createClient(6379, "pubsub.redis.default.svc.cluster.local");

let clientpag = redis.createClient(6379, "cadpag.rediscadpag.default.svc.cluster.local");

app.use(express.json());

//Microservico Pagamento (30123)
const port = process.env.PORT || 30123

//Lista de Pagamentos em Memória
const lpagamento =  [
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

app.get('/api/pagamento/vivo', async (req, res) => {
	
	res.send('Olá o microservico Pagamento esta Online em /api/pagamento');
});

//Verifica se esta salvando o que recebeu do Message Broker PUBSUB em memoria para processar
app.get('/api/pagamento/checkin', async (req, res) => {

	const retorno = notafiscal.map(c => c);
	if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	res.send(retorno);
});

app.get('/api/pagamento/lista', async (req, res) => {

	const retorno = lpagamento.map(c => c);
	if(!retorno) res.status(404).send('Nao existe Pagamentos na lista');
	res.send(retorno);
});

app.get('/api/pagamento/:id', async (req, res) => {
	
	//const retorno = pagamento.find(c => c.id === parseInt(req.params.id));
	//if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	//res.send(retorno);
	let id = req.params.id;

	clientpag.hgetall(id, function(err, obj){
		if(!obj){
		  res.send(err);
		} else {
		  obj.id = id;
		  res.send(obj);
		}
	});
});

app.post('/api/pagamento/', (req, res) => {
	
	let id = lpagamento.length; //+ 1 ;
	let idatendimento = (req.body.idatendimento) ? req.body.idatendimento : "0" ;
	let name = req.body.name;
	let nif = req.body.nif;
	let pagamento = req.body.pagamento;
	
	const novo = {
		id: id,
		idatendimento: idatendimento,
		name: name,
		nif: nif,
		pagamento: pagamento
	}
	
	clientpag.hmset(id, [
    'idatendimento', idatendimento,
    'name', name,
	'nif',nif,
	'pagamento',pagamento
	], function(err, reply){
    if(err){
      console.log(err);
    }
	console.log('Pagamento salvo no REDIS: ');
    console.log(reply);
    //res.redirect('/');
	});
	
	console.log(novo);
	lpagamento.push(novo);
	res.send(novo);
});

app.listen(port, () => {
  console.log(`Pagamento na porta ${port}`)
});