const express = require('express');
const cookieParser = require('cookie-parser');
const {v4: uuidv4} = require('uuid');
const fs = require('fs');

const app = express();

app.use(cookieParser());

const atividade = [];

function saveJson() {
    const jsonData = JSON.stringify(atividade, null, 2);
    fs.writeFileSync('atividade.json', jsonData )
}

function verifyJson(req, res, next) {
    try {
        const jsonData2 = fs.readFileSync('atividade.json', 'utf-8');
        atividade.push(...JSON.parse(jsonData2))
    } catch (error) {
        console.log('erro ao encontrar o arquivo. ' + error)
    }
    next();
}

app.use(verifyJson);

app.get('/', (req, res) => {
//   const visitCount = req.cookies.visitCount || 0;
//   res.cookie('visitCount', parseInt(visitCount) + 1, { maxAge: 3600000, httpOnly: true });

//   const username = req.cookies.username || 'Rauber';
//   const language = req.cookies.language || 'pt-br';
  
//   res.send(`Olá ${username}! Seu idioma preferido é ${language}. Você visitou esta página ${visitCount} vezes.`);

let userId = req.cookies.userId;

  if (!userId) {

    userId = uuidv4();
    res.cookie('userId', userId, { httpOnly: true });
  }

  res.send(`Olá, usuário! Seu ID é: ${userId}`);
});

app.get('/pagina1', (req, res) => {
    const userId = req.cookies.userId;

    atividade.push({ userId, activity: 'Visitou a página 1', timestamp: new Date() });
  
    saveJson();

    res.send('Você está na página 1.');
  });
  
  app.get('/pagina2', (req, res) => {
    const userId = req.cookies.userId;
  
    atividade.push({ userId, activity: 'Visitou a página 2', timestamp: new Date() });
    saveJson();

    res.send('Você está na página 2.');
  });
  
  app.get('/atividades', (req, res) => {
    res.json(atividade);
  });

  app.get('/clear', (req, res) => {
    atividade.length = 0;

    saveJson();

    res.send('jsonfile, limpado com sucesso');
  })

app.listen(3000, () => {
  console.log(`Servidor rodando`);
});