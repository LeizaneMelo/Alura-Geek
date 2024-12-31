const express = require('express');
 const fs = require('fs');
const app = express();
const PORT = 3000;
const cors = require('cors');

// Habilitar CORS

  app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  }));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Banco de dados fake inicializado com produtos do arquivo JSON
let produtos = [];

// Função para carregar produtos de um arquivo JSON
function carregarProdutos() {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error("Erro ao carregar produtos:", err);
      return;
    }
    produtos = JSON.parse(data).produtos;
  });
}

// Carregar produtos ao iniciar o servidor
carregarProdutos();

// Rota para listar produtos
app.get('/produtos', (req, res) => {
  res.json(produtos);
});

// Rota para adicionar um novo produto
app.post('/adiciona-produto', (req, res) => {
  const { nome, preco, img } = req.body;
  const novoProduto = { id: Date.now(), nome, preco, img };
  produtos.push(novoProduto);
  
  // Atualizar o db.json com o novo produto
  fs.writeFile('db.json', JSON.stringify({ produtos }, null, 2), (err) => {
    if (err) {
      console.error("Erro ao salvar o produto:", err);
      return res.status(500).json({ message: "Erro ao salvar o produto" });
    }
    res.status(201).json(novoProduto);
  });
});

// Rota para deletar um produto pelo ID
app.delete('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  produtos = produtos.filter(produto => produto.id !== id);

  // Atualizar o db.json após a exclusão
  fs.writeFile('db.json', JSON.stringify({ produtos }, null, 2), (err) => {
    if (err) {
      console.error("Erro ao salvar as alterações:", err);
      return res.status(500).json({ message: "Erro ao salvar as alterações" });
    }
    res.json({ message: 'Produto excluído com sucesso' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});