const express = require('express');
const app = express();
const port = 3000;

// Middleware de autenticação (exemplo simples)
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token || token !== 'seu_token_secreto') {
        return res.status(401).json({ message: 'Acesso não autorizado' });
    }
    next();
};

// Endpoint seguro
app.get('/confidential-data', authenticate, (req, res) => {
    // Executa um serviço fictício para obter os dados a serem retornados
    const jsonData = service.call(req);

    // Retorna os dados
    res.json(jsonData);
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
