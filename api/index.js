import fs from 'fs/promises';


let produtos = [];

async function carregarProdutos() {
  try {
    const data = await fs.readFile('db.json', 'utf8');
    produtos = JSON.parse(data).produtos;
  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
  }
}

export default async function handler(req, res) {
  await carregarProdutos();

  if (req.method === 'GET') {
    return res.status(200).json(produtos);
  }

  if (req.method === 'POST') {
    const { nome, preco, img } = req.body;
    const novoProduto = { id: Date.now(), nome, preco, img };
    produtos.push(novoProduto);

    try {
      await fs.writeFile('db.json', JSON.stringify({ produtos }, null, 2));
      return res.status(201).json(novoProduto);
    } catch (err) {
      console.error("Erro ao salvar o produto:", err);
      return res.status(500).json({ message: "Erro ao salvar o produto" });
    }
  }

  return res.status(405).json({ message: 'Método não permitido' });
}
