const mongoose = require("mongoose");
//Mongoose ODM mapeador objeto relacional de node.js para MONGO.DB 
//Mongoose Model para Agendamento 
mongoose.model("Agendamento", {
	//Atributos : Horario, Dia, NomeCompleto, Email,
	horarioInicio{
		type: Number,
		require: true
	},
	horarioTermino{
		type: Number,
		require: true
	},
	dia{
		type: Date,
		require: true
	},
	nome{
		type: String,
		require: true
	},
	email{
		type: String,
		require: true
	}
	
});

