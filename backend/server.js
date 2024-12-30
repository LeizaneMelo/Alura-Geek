const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let produtos = [];

function carregarProdutos() {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error("Erro ao carregar produtos:", err);
      return;
    }
    produtos = JSON.parse(data).produtos;
  });
}

carregarProdutos();

app.get('/produtos', (req, res) => {
  res.json(produtos);
});

app.post('/adiciona-produto', (req, res) => {
  const { nome, preco, img } = req.body;
  const novoProduto = { id: Date.now(), nome, preco, img };
  produtos.push(novoProduto);
  
  fs.writeFile('db.json', JSON.stringify({ produtos }, null, 2), (err) => {
    if (err) {
      console.error("Erro ao salvar o produto:", err);
      return res.status(500).json({ message: "Erro ao salvar o produto" });
    }
    res.status(201).json(novoProduto);
  });
});

app.delete('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  produtos = produtos.filter(produto => produto.id !== id);

  fs.writeFile('db.json', JSON.stringify({ produtos }, null, 2), (err) => {
    if (err) {
      console.error("Erro ao salvar as alterações:", err);
      return res.status(500).json({ message: "Erro ao salvar as alterações" });
    }
    res.json({ message: 'Produto excluído com sucesso' });
  });
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
