const mongoose = require("mongoose");
//Mongoose ODM mapeador objeto relacional de node.js para MONGO.DB 
//Mongoose Model para Agendamento 
	//Atributos : Horario, Dia, NomeCompleto, Email
const AgendamentoSchema = new mongoose.Schema({
  horarioInicio: {
		type: Number,
		require: true
	},
	horarioTermino: {
		type: Number,
		require: true
	},
	dia: {
		type: Date,
		require: true
	},
	nome: {
		type: String,
		require: true
	},
	email: {
		type: String,
		require: true
	},
	criadoEm: {
		type: Date,
		Default: Date.now
	}
});
const Agendamento = mongoose.model("Agendamento", AgendamentoSchema);
module.exports = Agendamento;
	

