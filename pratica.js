const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
const secretKey = 'supersecretkey'; // Use a chave secreta adequada
const users = [
  { username: "user", password: "123456", id: 123, email: "user@dominio.com", perfil: "user" },
  { username: "admin", password: "123456789", id: 124, email: "admin@dominio.com", perfil: "admin" },
  { username: "colab", password: "123", id: 125, email: "colab@dominio.com", perfil: "user" },
];

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Função para gerar token JWT
function generateToken(user) {
  return jwt.sign({ id: user.id, perfil: user.perfil }, secretKey, { expiresIn: '1h' });
}

// Middleware para verificar o token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Endpoint para login do usuário
app.post('/api/auth/login', (req, res) => {
  const credentials = req.body;
  const userData = doLogin(credentials);

  if (userData) {
    const token = generateToken(userData);
    return res.json({ token });
  }

  res.status(401).json({ message: 'Invalid credentials' });
});

// Endpoint para recuperação dos dados do usuário logado
app.get('/api/users/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (user) {
    res.json({ id: user.id, username: user.username, email: user.email });
  } else {
    res.sendStatus(404);
  }
});

// Endpoint para recuperação dos dados de todos os usuários cadastrados
app.get('/api/users', authenticateToken, (req, res) => {
  if (req.user.perfil !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.status(200).json({ data: users });
});

// Endpoint para recuperação dos contratos existentes
app.get('/api/contracts/:empresa/:inicio', authenticateToken, (req, res) => {
  const { empresa, inicio } = req.params;
  const sanitizedEmpresa = sanitizeInput(empresa);
  const sanitizedInicio = sanitizeInput(inicio);

  const result = getContracts(sanitizedEmpresa, sanitizedInicio);
  if (result) {
    res.status(200).json({ data: result });
  } else {
    res.status(404).json({ data: 'Dados Não encontrados' });
  }
});

// Função de login
function doLogin(credentials) {
  return users.find(item => item.username === credentials.username && item.password === credentials.password);
}

// Sanitização de entrada para prevenir injeções
function sanitizeInput(input) {
  return input.replace(/[^a-zA-Z0-9_\-]/g, ''); // Permite apenas caracteres alfanuméricos e alguns especiais
}

// Classe fake emulando um script externo
class Repository {
  execute(query) {
    return [];
  }
}

// Recupera contratos (exemplo)
function getContracts(empresa, inicio) {
  const repository = new Repository();
  const query = `SELECT * FROM contracts WHERE empresa = '${empresa}' AND data_inicio = '${inicio}'`;
  return repository.execute(query);
}

