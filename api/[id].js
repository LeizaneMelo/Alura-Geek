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
  const { id } = req.query;
  await carregarProdutos();

  if (req.method === 'DELETE') {
    produtos = produtos.filter(produto => produto.id !== parseInt(id));

    try {
      await fs.writeFile('db.json', JSON.stringify({ produtos }, null, 2));
      return res.json({ message: 'Produto excluído com sucesso' });
    } catch (err) {
      console.error("Erro ao salvar as alterações:", err);
      return res.status(500).json({ message: "Erro ao salvar as alterações" });
    }
  }

  return res.status(405).json({ message: 'Método não permitido' });
}
