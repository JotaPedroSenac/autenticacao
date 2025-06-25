const express = require('express');
const AlunoController = require('../controllers/aluno.controller');
const router = express.Router();

// perfil

// rota de cadastro
router.post('/cadastrar', AlunoController.cadastrar)

module.exports = router;
