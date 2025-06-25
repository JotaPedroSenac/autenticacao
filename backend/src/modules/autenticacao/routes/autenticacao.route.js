const express = require('express');
const router = express.Router();

const AutenticacaoController = require('../controller/autenticacao.controller');

// Rota pública de login
router.post('/login', AutenticacaoController.login);

// Rota para sair
router.post('/logout', AutenticacaoController.sair);

// Rota usada pelo navegador para atualizar o token
router.post('/refresh-token', AutenticacaoController.refreshToken);

module.exports = router;
