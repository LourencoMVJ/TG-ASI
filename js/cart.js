// ===================== GERENCIAMENTO DO CARRINHO =====================

let carrinho = [];

// Carrega carrinho do sessionStorage
function carregarCarrinho() {
    const dados = sessionStorage.getItem('carrinho');
    carrinho = dados ? JSON.parse(dados) : [];
}

// Salva carrinho no sessionStorage E localStorage
function salvarCarrinho() {
    sessionStorage.setItem('carrinho', JSON.stringify(carrinho));
    localStorage.setItem('carrinho_backup', JSON.stringify(carrinho));
    atualizarBadgeCarrinho();
}

// Recupera carrinho do localStorage se sessionStorage estiver vazio
function recuperarCarrinhoPersistido() {
    if (carrinho.length === 0) {
        const backup = localStorage.getItem('carrinho_backup');
        if (backup) {
            carrinho = JSON.parse(backup);
            sincronizarCarrinhoComProdutos();
            salvarCarrinho();
        }
    }
}

// Remove itens do carrinho que não existem mais no catálogo
function sincronizarCarrinhoComProdutos() {
    if (!produtos || produtos.length === 0) {
        carrinho = [];
        return;
    }
    
    const idsValidos = produtos.map(p => p.id);
    const originalLength = carrinho.length;
    carrinho = carrinho.filter(item => idsValidos.includes(item.id));
    if (carrinho.length !== originalLength) {
        mostrarNotificacao('🧹 Carrinho sincronizado com catálogo');
    }
}

// Adiciona ao carrinho
function adicionarAoCarrinho(idProduto) {
    const produto = produtos.find(p => p.id === idProduto);
    if (!produto) return;
    
    const item = carrinho.find(i => i.id === idProduto);
    
    if (item) {
        item.quantidade++;
        mostrarNotificacao(`🛒 ${produto.nome} (Qtd: ${item.quantidade})`);
    } else {
        carrinho.push({
            id: idProduto,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: 1
        });
        mostrarNotificacao(`✅ ${produto.nome} adicionado ao carrinho!`);
    }
    
    salvarCarrinho();
    renderizarCarrinho();
}

// Remove do carrinho
function removerDoCarrinho(id) {
    const item = carrinho.find(i => i.id === id);
    if (item) {
        mostrarNotificacao(`🗑️ ${item.nome} removido`);
    }
    carrinho = carrinho.filter(i => i.id !== id);
    salvarCarrinho();
    renderizarCarrinho();
}

// Renderiza carrinho
function renderizarCarrinho() {
    sincronizarCarrinhoComProdutos();
    const container = document.getElementById('containerCarrinho');
    if (!container) return;
    
    if (carrinho.length === 0) {
        container.innerHTML = '<div class="vazio">Carrinho vazio</div>';
        renderizarResumo();
        return;
    }
    
    const html = carrinho.map(item => {
        const subtotal = (parseFloat(item.preco) * item.quantidade).toFixed(2);
        return `
            <div class="item-carrinho">
                <div class="item-info">
                    <strong>${item.nome}</strong>
                    <span class="preco">MZM ${parseFloat(item.preco).toFixed(2)}</span>
                </div>
                <div class="item-controles">
                    <button onclick="alterarQuantidade(${item.id}, -1)" class="btn-qtd">−</button>
                    <span class="qtd">${item.quantidade}</span>
                    <button onclick="alterarQuantidade(${item.id}, 1)" class="btn-qtd">+</button>
                </div>
                <div class="item-subtotal">MZM ${subtotal}</div>
                <button onclick="removerDoCarrinho(${item.id})" class="btn-remover">🗑️</button>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
    renderizarResumo();
}

// Altera quantidade
function alterarQuantidade(id, delta) {
    const item = carrinho.find(i => i.id === id);
    if (!item) return;
    
    item.quantidade += delta;
    
    if (item.quantidade <= 0) {
        removerDoCarrinho(id);
    } else {
        salvarCarrinho();
        renderizarCarrinho();
    }
}

// Remove do carrinho
function removerDoCarrinho(id) {
    const item = carrinho.find(i => i.id === id);
    if (item) {
        mostrarNotificacao(`🗑️ ${item.nome} removido`);
    }
    carrinho = carrinho.filter(i => i.id !== id);
    salvarCarrinho();
    renderizarCarrinho();
}

// Limpa todo o carrinho
function limparCarrinho() {
    if (!confirm('Limpar todo o carrinho?')) return;
    carrinho = [];
    salvarCarrinho();
    renderizarCarrinho();
    mostrarNotificacao('🗑️ Carrinho limpado');
}

// Calcula total
function calcularTotal() {
    return carrinho.reduce((total, item) => {
        return total + (parseFloat(item.preco) * item.quantidade);
    }, 0);
}

// Calcula impostos (10%)
function calcularImpostos(total) {
    return (total * 0.10).toFixed(2);
}

// Renderiza resumo do carrinho
function renderizarResumo() {
    const container = document.getElementById('resumoCarrinho');
    if (!container) return;
    
    const subtotal = calcularTotal();
    const impostos = calcularImpostos(subtotal);
    const total = (parseFloat(subtotal) + parseFloat(impostos)).toFixed(2);
    const quantidade = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    
    container.innerHTML = `
        <div class="resumo-linha">
            <span>Itens:</span>
            <strong>${quantidade}</strong>
        </div>
        <div class="resumo-linha">
            <span>Subtotal:</span>
            <strong>MZM ${subtotal.toFixed(2)}</strong>
        </div>
        <div class="resumo-linha">
            <span>Impostos (10%):</span>
            <strong>MZM ${impostos}</strong>
        </div>
        <div class="resumo-linha resumo-total">
            <span>TOTAL:</span>
            <strong>MZM ${total}</strong>
        </div>
        <button onclick="finalizarCompra()" class="btn-finalizar">✅ Finalizar Compra</button>
        <button onclick="limparCarrinho()" class="btn-limpar">🗑️ Limpar Carrinho</button>
    `;
}

// Finaliza compra
function finalizarCompra() {
    if (carrinho.length === 0) {
        alert('Carrinho vazio!');
        return;
    }
    
    const total = calcularTotal();
    if (confirm(`Finalizar compra no valor de MZM ${parseFloat(total).toFixed(2)}?`)) {
        
    }
}

// Atualiza badge do carrinho
function atualizarBadgeCarrinho() {
    const badge = document.getElementById('badgeCarrinho');
    if (badge) {
        const quantidade = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
        badge.textContent = quantidade;
        badge.style.display = quantidade > 0 ? 'block' : 'none';
    }
}
