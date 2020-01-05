const express = require("express")
const app = express()
app.use(express.json());

const port = process.env.PORT || 8080

const courses =  [
{ id: 1, name: "nome1"}
{ id: 2, name: "nome2"}
{ id: 3, name: "nome3"}
];

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
	
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if(!course) res.status(404).send("Nao existe na lista com o ID especificado");
	res.send(course);
});


app.listen(port, () => {
  console.log(`servicoX listening on ${port}`)
});