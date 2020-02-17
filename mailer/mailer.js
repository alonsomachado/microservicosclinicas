const express = require('express');
const app = express(); 
const redis = require('redis');
const nodemailer = require('nodemailer');

const subscriber = redis.createClient(6379, "pubsub.redis.default.svc.cluster.local");

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

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'youremail@gmail.com',
    pass: 'yourpassword'
  }
});

let mailOptions = {
  from: 'youremail@gmail.com',
  to: 'myfriend@yahoo.com',
  subject: 'Consulta na Clinica Portugal',
  text: 'Você tem uma consulta marcada amanhã na Clinica Portugal!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email enviado: ' + info.response);
  }
});

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

app.get('/api/mail/vivo', async (req, res) => {
	
	res.send('Olá o microservico envio de Email esta Online!');
});

app.get('/api/mail/lista', async (req, res) => {
	const retorno = lista.map(c => c);
	if(!retorno) res.status(404).send('Nao existe lista de Check-in');
	res.send(retorno);
});

app.get('/api/checkin/agendamentosrecebidos', async (req, res) => {
	const retorno = agend.map(c => c);
	if(!retorno) res.status(404).send('Nao existe Agendamentos recebidos por Check-in');
	res.send(retorno);
});

app.get('/api/mail/:id', async (req, res) => {
	
	const retorno = lista.find(c => c.id === parseInt(req.params.id));
	if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	res.send(retorno);
});


app.listen(port, () => {
  console.log(`Realiza na porta ${port}`)
});