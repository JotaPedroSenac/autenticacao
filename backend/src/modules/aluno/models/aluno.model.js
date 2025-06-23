const { DataTypes } = require('sequelize');
const { Sequelize } = require('../../../config/configDB');

const Aluno = Sequelize.define(
  'Aluno',
  {
    // Model attributes are defined here
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    matricula: {
      type: DataTypes.STRING,
      primaryKey: true,
      validate: {
        is: {
          args: /^[A-Za-z]\d{8}$/,
          msg: 'A matricula deve iniciar com uma letra e 8 numeros'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Email inválido"
        }
      }
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          msg: 'A senha deve ter no mínimo 8 caracteres, com ao menos uma letra maiúscula, uma minúscula, um número e um caractere especial (@$!%*?&).'

        }
      }
    }

  },
  {
    modelName: 'aluno',
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
  },
);

module.exports = Aluno;