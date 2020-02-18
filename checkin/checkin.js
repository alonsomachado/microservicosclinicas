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
{ id: 0, idagendamento: 1, name: 'Teste', utente: '111000222', valor: 20},

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
	
	res.send('Olá o microservico Checkin esta Online em /api/checkin/');
});

app.get('/api/checkin/lista', async (req, res) => {
	const retorno = lista.map(c => c);
	if(!retorno) res.status(404).send('Nao existe lista de Check-in');
	res.send(retorno);
});

//Verifica se esta salvando o que recebeu do Message Broker PUBSUB em memoria para processar
app.get('/api/checkin/agendamentosrecebidos', async (req, res) => {
	const retorno = agend.map(c => c);
	if(!retorno) res.status(404).send('Nao existe Agendamentos recebidos por Check-in');
	res.send(retorno);
});

app.get('/api/checkin/:id', async (req, res) => {
	
	//const retorno = lista.find(c => c.id === parseInt(req.params.id));
	//if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	//res.send(retorno);
	
	let id = req.params.id;

	clientcheckin.hgetall(id, function(err, obj){
		if(!obj){
		  res.send(err);
		} else {
		  obj.id = id;
		  res.send(obj);
		}
	});
});

app.post('/api/checkin/', (req, res) => {
	
	let id = lista.length; //+ 1 ;
	let idagendamento = (req.body.idagendamento) ? req.body.idagendamento : "0";
	let name = req.body.name;
	let utente = req.body.utente;
	let valor = req.body.valor;
	
	const novo = {
		id: id,
		idagendamento: idagendamento,
		name: name,
		utente: utente,
		valor: valor
	}
	
	clientcheckin.hmset(id, [
    'idagendamento', idagendamento,
    'name', name,
	'utente',utente,
	'valor',valor
	], function(err, reply){
    if(err){
      console.log(err);
    }
    console.log(reply);
    //res.redirect('/');
	});
	console.log('Checkin salvo no REDIS');
	lista.push(novo);
	console.log('Checkin salvo na Lista em memória');
		
	publisher.publish("checkin",JSON.stringify(novo));
	console.log("Publicou no Redis Pub/Sub- checkin");
	res.send(novo);
});

app.listen(port, () => {
  console.log(`Realiza na porta ${port}`)
});