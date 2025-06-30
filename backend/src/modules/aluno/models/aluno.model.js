const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/configDB");

const Aluno = sequelize.define(
  "Aluno",
  {
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
          msg: "A matricula deve iniciar com uma letra e ter 8 números!",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Email inválido" },
      },
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
      validade: {
        is: {
          args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          msg: "A senha deve ter no mínimo 8 caracteres, com letra maiúscula, minúscula, número e caractere especial.",
        },
      },
    },
  },
  {
    tableName: "aluno",
    createdAt: "criado_em",
    updatedAt: "atualizado_em",
  }
);

module.exports = Aluno;