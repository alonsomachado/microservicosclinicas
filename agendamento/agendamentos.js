const express = require("express")
const app = express();
app.use(express.json());

//Mongoose ODM mapeador objeto relacional de node.js para MONGO.DB 
const mongoose = require("mongoose");
mongoose.connect({"mongodb+srv://testemongodb:modbMAdTU3sjEqns@testandomongodb-pklgf.mongodb.net/test?retryWrites=true&w=majority", () => console.log("Conectou ao Banco de Dados"); });
//User do BD: testemongodb e Senha do BD: modbMAdTU3sjEqns

//Microservico Agendamento (3001)
const port = process.env.PORT || 3001

//Por enquanto assim, depois criar CRUDs de cada agendamento e Conectar ao BD
const agendamento =  [
{ id: 1, name: "nome1", email: "joao@gmail.com"}
{ id: 2, name: "nome2", email: "elll2@gmail.com"}
{ id: 3, name: "nome3", email: "sss@gmail.com"}
];

app.get("/api/agendamento", (req, res) => {
	res.send("Olá o microservico Agendamento esta Online");
});

app.get("/api/agendamento/:Id", (req, res) => {
	
	const retorno = agendamento.find(c => c.id === parseInt(req.params.id));
	if(!retorno) res.status(404).send("Nao existe na lista com o ID especificado");
	res.send(retorno);
});

app.post("/api/agendamento/:Id", (req, res) => {
	
	
	const novo = {
		id: agendamento.length + 1;
		name: req.body.name
	}
	agendamento.push(novo);
	res.send(novo);
});


app.listen(port, () => {
  console.log(`servicoX listening on ${port}`)
});