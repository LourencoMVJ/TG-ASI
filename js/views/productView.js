function renderizarProdutos() {
    const container = document.getElementById('containerListaProdutos');
    if (!container) return;

    if (produtos.length === 0) {
        container.innerHTML = '<div class="vazio">Nenhum produto cadastrado</div>';
        return;
    }

    container.innerHTML = produtos.map(p => `
        <div class="produto-item">
            <div class="produto-info">
                <strong>${p.nome}</strong>
                <span class="preco-pequeno">MZN ${parseFloat(p.preco).toFixed(2)}</span>
            </div>
            <div class="produto-acoes">
                ${ehAdmin()
                    ? `<button onclick="removerProduto(${p.id})" class="btn-remover">Remover</button>`
                    : `<button onclick="adicionarAoCarrinho(${p.id})" class="btn-adicionar">Adicionar ao carrinho</button>`
                }
            </div>
        </div>
    `).join('');
}
