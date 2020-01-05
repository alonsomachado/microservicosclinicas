const express = require("express")
const app = express();
app.use(express.json());

// Instalar NODEMON para rodar o index.js facailita muito nao ter de ficar reiniciando....

//Microservico Principal (API GATEWAY)
const port = process.env.PORT || 8080

//Microservico Pagamento (3002)
//Microservico Agendamento (3001)

app.get("/api/", (req, res) => {
	res.send("Olá a API esta Online");
});

app.get("/api/id/:Id", (req, res) => {
	res.send(req.params.id);
	
});
app.get("/api/courses/:Id", (req, res) => {
	
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if(!course) res.status(404).send("Nao existe na lista com o ID especificado");
	res.send(course);
});

app.post("/api/courses/:Id", (req, res) => {
	
	
	const novoCurso = {
		id: courses.length + 1;
		name: req.body.name
	}
	courses.push(novoCurso);
	res.send(novoCurso);
});


app.listen(port, () => {
  console.log(`servicoX listening on ${port}`)
});