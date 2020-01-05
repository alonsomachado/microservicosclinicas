const express = require("express");
const app = express();
app.use(express.json());

//Mongoose ODM mapeador objeto relacional de node.js para MONGO.DB 
const mongoose = require("mongoose");
mongoose.connect({"mongodb+srv://testemongodb:modbMAdTU3sjEqns@testandomongodb-pklgf.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true} , () => console.log("Conectou ao Banco de Dados"); });
//User do BD: testemongodb e Senha do BD: modbMAdTU3sjEqns

require("./agendamento");
//Constante que vai ser o acesso a esta tabela
const Agendamento = mongoose.model("agendamento");

//Microservico Agendamento (3001)
const port = process.env.PORT || 3001

//Health Check
app.get("/api/agendamentos/vivo", (req, res) => {
	res.send("Olá o microservico Agendamento esta Online");
});

//Lista todos os Agendamentos Marcados
app.get("/api/agendamentos", (req, res) => {
	Agendamento.find().then( (agendamentos) => {
		res.json(agendamentos);
	});
});

//Escolhe Aquele Elemento entre os Agendamentos Marcados
app.get("/api/agendamento/:id", (req, res) => {
	
	Agendamento.findById(req.params.id).then( (agendamento) => {
		if(!agendamento) res.send("Nao existe na lista com o ID especificado");
		res.json(agendamento);
	});
});

//Para DELETAR Agendamento.findOneAndRemove(req.params.id).then();

//Cria um novo agendamento por POST
app.post("/api/agendamento/:id", (req, res) => {
	
	var novo = {
		horarioInicio: req.body.horarioInicio,
		horarioTermino: req.body.horarioTermino,
		dia: req.body.dia,
		nome: req.body.nome,
		email: req.body.email
	}
	
	//Cria o agendamento na tabela do MongoDb com Mongoose
	var retorno = new Agendamento(novo)
	retorno.save().then( () => {
		console.log("Agendamento novo salvo no BD");
	});
	res.send(novo);
});


app.listen(port, () => {
  console.log(`Servico agendamentos escutando na porta: ${port}`)
});