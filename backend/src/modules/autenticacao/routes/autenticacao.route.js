const express = require('express');
const { cadastrar } = require('../../aluno/controllers/aluno.controller')
const router = express.Router()

const { login, refreshToken, sair } = require('../controller/autenticacao.controller')

// rota publica de login
router.post('/login', login);

// rota de cadastro
router.post('/cadastrar', cadastrar)
// rota para sair 
router.post('/logout', sair);

// rota usada pelo navegador para atualizar o token 
router.post('/refress-token', refreshToken);

module.exports = router
