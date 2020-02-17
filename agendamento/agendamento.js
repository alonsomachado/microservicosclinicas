const express = require('express');
const app = express();
const redis = require('redis');

const publisher = redis.createClient(6379, "pubsub.redis.default.svc.cluster.local");

let clientagen = redis.createClient(6379, "cadagen.rediscadagen.default.svc.cluster.local");

app.use(express.json());

//Microservico Agendamento porta padrao 30123
const port = process.env.PORT || 30123

const agend =  [

{ id: 0, horarioInicio: '08:00', horarioTermino: '08:55', dia: '14/01/2020', nome: 'Teste1', email: 'joao@gmail.com', medico: 'Joao Pedro Cunha'},
{ id: 1, horarioInicio: '08:00', horarioTermino: '08:55', dia: '16/01/2020', nome: 'Teste3', email: 'joao@gmail.com', medico: 'Paula Tavares Guimaraes'},

];

const medico =  [
{ id: 1, nome: 'Joao Pedro Cunha', email: 'joaopc@gmail.com', manha: 'True', tarde: 'True', especialidade: 'Pediatra'},
{ id: 2, nome: 'Manoel de Sa Carvalhal', email: 'manoelsc@gmail.com', manha: 'True', tarde: 'True', especialidade: 'Clinico Geral'},
{ id: 3, nome: 'Pedro Afonso Melo Campos', email: 'pedroafm@gmail.com', manha: 'True', tarde: 'True', especialidade: 'Oftamologista'},
{ id: 4, nome: 'Paula Tavares Guimaraes', email: 'paulatg@gmail.com', manha: 'False', tarde: 'True', especialidade: 'Pediatra'},
{ id: 5, nome: 'Joana Guedes Dutra', email: 'joanagd@gmail.com', manha: 'True', tarde: 'False', especialidade: 'Oftamologista'}
];

app.get('/api/agendamento/lista', async (req, res) => {
	//res.send('Olá o microservico Pagamento esta Online em /braga/pagamento SEM  O /');
	const retorno = agend.map(c => c);
	if(!retorno) res.status(404).send('Nao existe Agendamento na lista');
	res.send(retorno);
});


app.get('/api/agendamento/:id', async (req, res) => {
	
	//const retorno = agend.find(c => c.id === parseInt(req.params.id));
	//if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	//res.send(retorno);
	
	let id = req.params.id;

	clientagen.hgetall(id, function(err, obj){
		if(!obj){
		  res.send(err);
		} else {
		  obj.id = id;
		  res.send(obj);
		}
	});
});

app.post('/api/agendamento/', (req, res) => {
	
	let id = agend.length + 1;
	let horarioInicio = req.body.horarioInicio;
	let horarioTermino = req.body.horarioTermino;
	let dia = req.body.dia;
	let nome = req.body.nome;
	let email = req.body.email;
	let medico = req.body.medico;
	
	const novo = {
		id: id,
		horarioInicio: horarioInicio,
		horarioTermino: horarioTermino,
		dia: dia,
		nome: nome,
		email: email,
		medico: medico
	}
	
	clientagen.hmset(id, [
    'horarioInicio', horarioInicio,
    'horarioTermino', horarioTermino,
	'dia',dia,
	'nome',nome,
    'email', email,
    'medico', medico
	], function(err, reply){
    if(err){
      console.log(err);
    }
    console.log(reply);
    //res.redirect('/');
	});
	
	console.log(novo);
	agend.push(novo);
	publisher.publish("agendamento",JSON.stringify(novo));
	console.log("Publicou no Redis Pub/Sub - agendamento");
	res.send(novo);
});

app.listen(port, () => {
  console.log(`Agendamento na porta ${port}`)
});