const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 80;
  

app.get('/', (req, res) => {

  res.send('Este es el servicio de backend para el proyecto de IA en UPN 2024-2');
});

app.post('/login',(req, res) => {
    console.log(req.query);
    const {user,pass} = req.query;
    if(pass==="1234"){
        res.send("Credenciales validas");
    }else{
        res.send("Invalido")
    }
    
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});