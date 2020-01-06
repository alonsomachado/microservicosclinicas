const express = require("express");
const app = express();
app.use(express.json());

// Instalar NODEMON para rodar o index.js facailita muito nao ter de ficar reiniciando....
// npm install -g nodemon 

//Microservico Principal (API GATEWAY)
const port = process.env.PORT || 8080

//Microservico Pagamento (3000)
//Microservico Agendamento (3001)

app.get("/api", (req, res) => {
	res.send("Olá a API esta Online");
});


app.post("/api/courses/:Id", (req, res) => {
	
	res.send(novoCurso);
});


app.listen(port, () => {
  console.log(`servicoX listening on ${port}`)
});