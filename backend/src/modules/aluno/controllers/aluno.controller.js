const Aluno = require('../models/aluno.model');
const bcrypt = require('bcryptjs');

class AlunoController{
    static async cadastrar(req, res){
        const { matricula, nome, email, senha } = req.body;
        if(!matricula || !nome || !email || !senha){
            return res.status(400).json({msg: 'Todos os campos devem ser preenchidos'})
        }
        const senhaCriptografada = await bcrypt.hash(senha, 15);
        await Aluno.create({ matricula, nome, email, senhaCriptografada })
        res.status(200).json({msg: 'Aluno criado com sucesso!'})
    }

    static async perfil(req, res){
        try {
            // const matricula = req.params.matricula;
            const aluno = await Aluno.findAll();
            if(!aluno){
                return res.status(401).json({msg: 'Não existe aluno cadastrado'})
            }
            res.status(200).json(aluno)
        } catch (error) {
            res.status(500).json({msg: "Erro do servidor. Tente novamente mais tarde"})
        }
    }
}

module.exports = AlunoController;