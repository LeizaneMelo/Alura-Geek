const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let produtos = [];

// Carregar produtos
fs.readFile('db.json', 'utf8', (err, data) => {
  if (!err) produtos = JSON.parse(data).produtos || [];
});

// Rota para listar produtos
app.get('/produtos', (req, res) => res.json(produtos));

// Rota para adicionar um novo produto
app.post('/adiciona-produto', (req, res) => {
  const { nome, preco, img } = req.body;
  const novoProduto = { id: Date.now(), nome, preco, img };
  produtos.push(novoProduto);

  fs.writeFile('db.json', JSON.stringify({ produtos }, null, 2), (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao salvar o produto' });
    res.status(201).json(novoProduto);
  });
});

// Rota para deletar um produto
app.delete('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  produtos = produtos.filter(p => p.id !== id);

  fs.writeFile('db.json', JSON.stringify({ produtos }, null, 2), (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao salvar alterações' });
    res.json({ message: 'Produto excluído com sucesso' });
  });
});

module.exports = app;
