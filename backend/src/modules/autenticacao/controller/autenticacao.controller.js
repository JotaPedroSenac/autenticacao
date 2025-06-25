const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Aluno = require('../../aluno/models/aluno.model');

dotenv.config();

const tempo_acess_token = process.env.TEMPO_ACESS_TOKEN;
const tempo_refresh_token = process.env.TEMPO_REFRESH_TOKEN;

class AutenticacaoController {
  static gerarTokenAcesso(dadosAluno) {
    return jwt.sign(dadosAluno, process.env.SECRET_KEY, {
      expiresIn: tempo_acess_token
    });
  }

  static gerarRefreshToken(dadosAluno) {
    return jwt.sign(dadosAluno, process.env.JWT_REFRESH_SECRET, {
      expiresIn: tempo_refresh_token
    });
  }

  static async login(req, res) {
    try {
      const { matricula, senha } = req.body;

      if (!matricula || !senha) {
        return res.status(400).json({ msg: 'É necessário informar matrícula e senha.' });
      }

      const aluno = await Aluno.findOne({ where: { matricula } });

      if (!aluno) {
        return res.status(401).json({ msg: 'Aluno não encontrado' });
      }

      const senhaCorreta = await bcrypt.compare(senha, aluno.senha);

      if (!senhaCorreta) {
        return res.status(400).json({ msg: 'Matrícula ou senha incorretos' });
      }

      const dadosAluno = {
        matricula: aluno.matricula,
        nome: aluno.nome,
        papel: 'aluno'
      };

      const tokenAcesso = AutenticacaoController.gerarTokenAcesso(dadosAluno);
      const refreshToken = AutenticacaoController.gerarRefreshToken(dadosAluno);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000 // 1 dia
      });

      res.status(200).json({
        msg: 'Aluno logado com sucesso',
        tokenAcesso,
        nome: aluno.nome,
        papel: "aluno"
      });

    } catch (error) {
      res.status(500).json({
        msg: 'Erro interno do servidor',
        erro: error.message
      });
    }
  }

  static refreshToken(req, res) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(403).json({ msg: "Refresh token inválido!" });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (erro, usuario) => {
      if (erro) {
        return res.status(403).json({ msg: "Refresh token inválido!" });
      }

      const dadosAluno = {
        matricula: usuario.matricula,
        nome: usuario.nome,
        papel: "aluno"
      };

      const novoTokenAcesso = this.gerarTokenAcesso(dadosAluno);

      res.status(200).json({ tokenAcesso: novoTokenAcesso });
    });
  }

  static async sair(req, res) {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });

      res.status(200).json({ msg: "Logout realizado com sucesso" });
    } catch (error) {
      res.status(500).json({ msg: 'Erro interno ao sair', erro: error.message });
    }
  }
}

module.exports = AutenticacaoController;
