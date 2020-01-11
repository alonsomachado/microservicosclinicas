const express = require('express');
const app = express();

app.use(express.json());

//Mongoose ODM mapeador objeto relacional de node.js para MONGO.DB 
const mongoose = require('mongoose');
//mongoose.connect({'', () => console.log('Conectou ao Banco de Dados'); });

//Microservico Pagamento (30123)
const port = process.env.PORT || 30123

const pagamento =  [
{ id: 1, name: 'Joao', email: 'joao@gmail.com', pagamento: 20},
{ id: 2, name: 'nome2', email: 'elll2@gmail.com', pagamento: 15},
{ id: 3, name: 'Pedro', email: 'Pesss@gmail.com', pagamento: 25},
{ id: 4, name: 'Paula', email: 'Pasdasd@gmail.com', pagamento: 15}
];

app.get('/', async (req, res) => {
	//res.status(200);
	res.send('Olá o microservico Pagamento esta Online em /');
});

app.get('/:id', async (req, res) => {
	res.send('ACESSOU GET ID PADRAO');
	//const retorno = pagamento.find(c => c.id === parseInt(req.params.id));
	//if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	//res.send(retorno);
});

app.get('/braga/pagamento', async (req, res) => {
	res.send('Olá o microservico Pagamento esta Online em /braga/pagamento SEM  O /');
	//const retorno = pagamento.find();
	//if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	//res.send(retorno);
});

app.get('/braga/pagamento/', async (req, res) => {
	res.send('Olá o microservico Pagamento esta Online em /braga/pagamento/ !!!');
	//const retorno = pagamento.find();
	//if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	//res.send(retorno);
});

app.get('/braga/pagamento/:id', async (req, res) => {
	
	const retorno = pagamento.find(c => c.id === parseInt(req.params.id));
	if(!retorno) res.status(404).send('Nao existe na lista com o ID especificado');
	res.send(retorno);
});

app.post('/braga/pagamento/', async (req, res) => {
	
	const novo = {
		id: pagamento.length + 1,
		name: req.body.name,
		email: req.body.email,
		pagamento: req.body.pagamento
	}
	pagamento.push(novo);
	res.send(novo);
});


app.listen(port, () => {
  console.log(`Pagamento na porta ${port}`)
});