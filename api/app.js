// app.js 
const express = require('express'); 
const app = express(); 
const port = 3000; 
// Middleware para analisar o corpo das requisições em JSON 
app.use(express.json()); 
// Importando as rotas do cliente 
const clienteRoutes = require('./routes/clienteRoutes'); 
// Usando as rotas do cliente com o prefixo '/clientes' 
app.use('/clientes', clienteRoutes); 
// Iniciando o servidor na porta especificada 
app.listen(port, () => { 
console.log(`Servidor rodando em http://localhost:${port}`); 
});