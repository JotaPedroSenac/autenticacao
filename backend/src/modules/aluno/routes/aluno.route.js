const express = require('express');
const AlunoController = require('../controllers/aluno.controller');
const AutenticacaoMiddleware = require('../middleware/aluno.middleware')
const router = express.Router();

// perfil

// rota de cadastro
router.post('/cadastrar', AlunoController.cadastrar);

// rota de perfil
router.get('/perfil', AutenticacaoMiddleware.autenticarToken, AlunoController.perfil)

module.exports = router;
