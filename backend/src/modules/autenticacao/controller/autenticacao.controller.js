const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Aluno = require('../../aluno/models/aluno.model');
const { where } = require('sequelize');

// Definindo variaveis de ambiente para TEMPO_ACESS_TOKEN e TEMPO_REFRESH_TOKEN
const tempo_acess_token = process.env.TEMPO_ACESS_TOKEN;
const tempo_refresh_token = process.env.TEMPO_REFRESH_TOKEN;

class AutenticacaoController {
    // gerar o token 
    static gerarTokenAcesso(dadosAluno) {
        return jwt.sign(dadosAluno, process.env.SECRET_KEY, {
            expiresIn: tempo_acess_token
        });
    };

    // gerar o refresh token
    static gerarRefressToken(dadosAluno) {
        return jwt.sign(dadosAluno, process.env.SECRET_KEY, {
            expiresIn: tempo_refresh_token
        });
    };

    static async login(req, res) {
        try {
            const { matricula, senha } = req.body;
            if (!matricula || !senha) {
                return res.status(400).json({ msg: 'É necessário informar email e senha' })
            }

            const aluno = await Aluno.findOne({
                where: { matricula }
            })

            if (!aluno) {
                return res.status(401).json({ msg: 'Aluno não encontrado' })
            }

            const senhaCorreta = await bcrypt.compare(senha, aluno.senha);
            if (!senhaCorreta) {
                return res.status(400).json({ msg: 'E-mail ou senha estão incorretos' })
            }

            const dadosAluno = {
                nome: aluno.nome,
                papel: 'aluno'
            }

            // gerando os tokens
            const tokenAcesso = AutenticacaoController.gerarTokenAcesso(dadosAluno);
            const refreshToken = AutenticacaoController.gerarRefressToken(dadosAluno);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV,
                sameStrict: 'strict',
                maxAge: 1 * 24, // 1dia
            })

            res.status(200).json({
                msg: 'Aluno logado com sucesso',
                tokenAcesso,
                nome: usuario.nome,
                papel: "aluno",
            });

        } catch (error) {
            res.status(500).json({ msg: 'Erro interno do servidor. Por favor tente mais tarde.', erro: error.message })
        }
    }

    // Método para renovar o refresh token
    static refreshToken(req, res) {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(403).json({ msg: "Refresh token invalido!" });
        }
        jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET,
            (erro, usuario) => {
                if (erro) {
                    return res.status(403).json({ msg: "Refresh invalido!" });
                }
                const dadosAluno = {
                    matricula: usuario.matricula,
                    nome: usuario.nome,
                    papel: "admin",
                };
                // gerando o novo token
                const novoTokenAcesso = this.gerarTokenAcesso(dadosAluno);
                // atualizando o token antigo para o novo
                res.status(200).json({ tokenAcesso: novoTokenAcesso });
            }
        );
    }

    static async sair(req, res) {
        try {
            res.clearCookies("refreshToken", {
                httpOnly: false,
                secure: process.env.NODE_ENV,
                sameStrict: "strict",
              });
        } catch (error) {
            res.status(500).json({msg: 'Erro interno do servidor', erro: error.message})
        }
    }
}

module.exports = AutenticacaoController;