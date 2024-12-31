const BASE_URL = "https://didactic-waffle-657jqwjqqqw347w-3000.app.github.dev/produtos"

async function fetchProdutos() {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error('Erro ao buscar produtos');
        const produtos = await response.json();
        renderizarProdutos(produtos);
    } catch (error) {
        console.error(error);
        document.querySelector('.nenhum_produto').innerText = 'Erro ao carregar produtos.';
    }
  }
  
  function renderizarProdutos(produtos) {
    const produtosContainer = document.querySelector('.produtos-container');
    const nenhumProdutoMsg = document.querySelector('.nenhum_produto');
  
    produtosContainer.innerHTML = '';
  
    if (produtos.length === 0) {
        nenhumProdutoMsg.style.display = 'block'; // Mostrar mensagem se não houver produtos
    } else {
        nenhumProdutoMsg.style.display = 'none'; // Ocultar mensagem se houver produtos
  
        produtos.forEach(produto => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src="${produto.img}" class="produto-imagem" alt="Imagem do produto">
                <div dados-produtos class="produtos-container">
                    <p class="produto-titulo">${produto.nome}</p>
                    <div class="card-container--value">
                        <div class="preco">
                        <p class="produto-preco"><b>$ ${produto.preco}</b></p>
                         
                         <p class="produto-delete" data-id="${produto.id}"><i class='bx bx-trash-alt'> </i></p> 
                        
                       </div>
                    </div>
                </div>
            `;
  
            card.querySelector('.produto-delete').addEventListener('click', () => {
                deletarProduto(produto.id);
            });
  
            produtosContainer.appendChild(card);
        });
    }
  }
  
  async function deletarProduto(id) {
    try {
        const response = await fetch(`${BASE_URL}/produtos/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erro ao deletar produto');
        fetchProdutos(); // Recarregar produtos após a exclusão
    } catch (error) {
        console.error(error);
    }
  }
  
  fetchProdutos();
  
  
  async function carregarProdutos() {
      const response = await fetch(BASE_URL);
      const produtos = await response.json();
      
      const container = document.querySelector('.nenhum_produto');
      const cardContainer = document.createElement('div');
      cardContainer.className = 'card-container';
      
      // Limpa a mensagem de "Nenhum produto encontrado"
      container.innerHTML = '';
  
      produtos.forEach(produto => {
          const card = document.createElement('div');
          card.className = 'card';
          card.innerHTML = `
              <img src="${produto.img}" class="produto-imagem" alt="Imagem do produto">
              <div class="produtos-container">
                  <p class="produto-titulo">${produto.nome}</p>
                  <div class="card-container--value">
                      <p class="produto-preco">Preço: $${produto.preco}</p>
                      <p class="produto-delete" onclick="deletarProduto(${produto.id})">X</p>
                  </div>
              </div>
          `;
          cardContainer.appendChild(card);
      });
  
      if (produtos.length === 0) {
          container.innerHTML = 'Nenhum produto encontrado';
      } else {
          container.appendChild(cardContainer);
      }
  }
  
  document.getElementById('form-adicionar-produto').addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const produto = {
          nome: document.getElementById('nome').value,
          preco: document.getElementById('preco').value,
          img: document.getElementById('img').value
      };
  
      try {
          const response = await fetch(`${BASE_URL}/adiciona-produto`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(produto)
          });
  
          if (response.ok) {
              const novoProduto = await response.json();
              console.log("Produto adicionado:", novoProduto);
              carregarProdutos(); // Atualiza a lista de produtos
              document.getElementById('form-adicionar-produto').reset(); // Reseta o formulário
          } else {
              console.error("Erro ao adicionar produto:", response.statusText);
          }
      } catch (error) {
          console.error("Erro na requisição:", error);
      }
  });
  
  // Carregar produtos quando a página for carregada
  window.onload = carregarProdutos;
  
  async function deletarProduto(id) {
      try {
          const response = await fetch(`${BASE_URL}/produtos/${id}`, {
              method: 'DELETE'
          });
  
          if (response.ok) {
              console.log("Produto excluído com sucesso");
              carregarProdutos();
          } else {
              console.error("Erro ao excluir produto:", response.statusText);
          }
      } catch (error) {
          console.error("Erro na requisição:", error);
      }
  }
  