const express = require("express");
const app = express();
app.use(express.json());

//Mongoose ODM mapeador objeto relacional de node.js para MONGO.DB 
const mongoose = require("mongoose");
//mongoose.connect({"", () => console.log("Conectou ao Banco de Dados"); });

//Microservico Pagamento (3002)
const port = process.env.PORT || 3002

const pagamento =  [
{ id: 1, name: "nome1", email: "joao@gmail.com"}
{ id: 2, name: "nome2", email: "elll2@gmail.com"}
{ id: 3, name: "nome3", email: "sss@gmail.com"}
];

app.get("/api/pagamento", (req, res) => {
	res.send("Olá o microservico Agendamento esta Online");
});

app.get("/api/pagamento/:Id", (req, res) => {
	
	const retorno = pagamento.find(c => c.id === parseInt(req.params.id));
	if(!retorno) res.status(404).send("Nao existe na lista com o ID especificado");
	res.send(retorno);
});

app.post("/api/pagamento/:Id", (req, res) => {
	
	const novo = {
		id: pagamento.length + 1;
		name: req.body.name
	}
	pagamento.push(novo);
	res.send(novo);
});


app.listen(port, () => {
  console.log(`servicoX listening on ${port}`)
});