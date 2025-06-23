const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const { sequelize } = require('./src/config/configDB');
const routeAluno= require('./src/modules/autenticacao/routes/autenticacao.route')

// Configuração do banco de dados
dotenv.config(); // Carrega variáveis de ambiente do arquivo .env

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // frontend React
    credentials: true               // permite enviar cookies (como refreshToken)
}));

app.use(express.json());



app.use('/', routeAluno)

const PORTA = process.env.PORTA;
app.listen(PORTA, async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');

        await sequelize.sync({ force: true, alter: true });
        console.log('Banco de dados sincronizado com sucesso.');
    } catch (err) {
        console.error('Erro ao conectar ou sincronizar o banco de dados:', err);
    }
    console.log(`Servidor rodando na porta ${PORTA}`);
});