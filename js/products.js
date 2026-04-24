// ===================== GERENCIAMENTO DE PRODUTOS =====================

let produtos = [];

// Carrega produtos do localStorage
function carregarProdutos() {
    const dados = localStorage.getItem('produtos');
    produtos = dados ? JSON.parse(dados) : [];
}

// Salva produtos no localStorage
function salvarProdutos() {
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Gera ID único para produto
function gerarIdProduto() {
    return produtos.length ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
}

// Renderiza lista de produtos
function renderizarProdutos() {
    const container = document.getElementById('containerListaProdutos');
    if (!container) return;
    
    if (produtos.length === 0) {
        container.innerHTML = '<div class="vazio">Nenhum produto cadastrado</div>';
        return;
    }
    
    const html = produtos.map(p => `
        <div class="produto-item">
            <div class="produto-info">
                <strong>${p.nome}</strong>
                <span class="preco">MZM ${parseFloat(p.preco).toFixed(2)}</span>
            </div>
            <div class="produto-acoes">
                <button onclick="adicionarAoCarrinho(${p.id})" class="btn-carrinho">🛒</button>
                ${ehAdmin() ? `<button onclick="removerProduto(${p.id})" class="btn-remover">❌</button>` : ''}
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Remove produto (apenas admin)
function removerProduto(id) {
    if (!ehAdmin()) {
        alert('❌ Acesso negado!');
        return;
    }
    
    if (!confirm('Remover este produto?')) return;
    produtos = produtos.filter(p => p.id !== id);
    salvarProdutos();
    renderizarProdutos();
    if (typeof sincronizarCarrinhoComProdutos === 'function') {
        sincronizarCarrinhoComProdutos();
        salvarCarrinho();
        renderizarCarrinho();
    }
    mostrarNotificacao('🗑️ Produto removido');
}
