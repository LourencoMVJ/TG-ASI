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
    carrinho = carrinho.filter(item => idsValidos.includes(item.id));
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
    renderizarPainelCarrinho(); // atualiza painel lateral
}

// Remove do carrinho (única definição)
function removerDoCarrinho(id) {
    const item = carrinho.find(i => i.id === id);
    if (item) mostrarNotificacao(`🗑️ ${item.nome} removido`);
    carrinho = carrinho.filter(i => i.id !== id);
    salvarCarrinho();
    renderizarCarrinho();
    renderizarPainelCarrinho();
}

// Renderiza carrinho (página carrinho.html)
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
        renderizarPainelCarrinho();
    }
}

// Limpa todo o carrinho
function limparCarrinho() {
    if (!confirm('Limpar todo o carrinho?')) return;
    carrinho = [];
    salvarCarrinho();
    renderizarCarrinho();
    renderizarPainelCarrinho();
    mostrarNotificacao('🗑️ Carrinho limpado');
}

// Calcula total
function calcularTotal() {
    return carrinho.reduce((total, item) => total + (parseFloat(item.preco) * item.quantidade), 0);
}

// Calcula impostos (10%)
function calcularImpostos(total) {
    return (total * 0.10).toFixed(2);
}

// Renderiza resumo do carrinho (páginas carrinho/checkout)
function renderizarResumo() {
    const container = document.getElementById('resumoCarrinho');
    if (!container) return;

    const subtotal = calcularTotal();
    const impostos = calcularImpostos(subtotal);
    const total = (subtotal + parseFloat(impostos)).toFixed(2);
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
    const total = calcularTotal().toFixed(2);
    if (confirm(`Finalizar compra no valor de MZM ${total}?`)) {
        alert('✅ Compra realizada com sucesso!');
        carrinho = [];
        salvarCarrinho();
        renderizarCarrinho();
        renderizarPainelCarrinho();
    }
}

// Atualiza badges (ícone flutuante e menu)
function atualizarBadgeCarrinho() {
    const quantidade = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    const badgeIcon = document.getElementById('badgeCarrinho');
    const badgeNav = document.getElementById('badgeCarrinhoNav');
    if (badgeIcon) {
        badgeIcon.textContent = quantidade;
        badgeIcon.style.display = quantidade > 0 ? 'flex' : 'none';
    }
    if (badgeNav) {
        badgeNav.textContent = quantidade;
        badgeNav.style.display = quantidade > 0 ? 'inline' : 'none';
    }
}

// ============ PAINEL LATERAL DO CARRINHO ============
function renderizarPainelCarrinho() {
    const conteudo = document.getElementById('painelCarrinhoConteudo');
    const resumo = document.getElementById('painelCarrinhoResumo');
    if (!conteudo || !resumo) return;

    if (carrinho.length === 0) {
        conteudo.innerHTML = '<div class="painel-carrinho-vazio">Carrinho vazio</div>';
        resumo.innerHTML = '';
        return;
    }

    let html = carrinho.map(item => {
        const subtotal = (parseFloat(item.preco) * item.quantidade).toFixed(2);
        return `
            <div class="painel-item">
                <div class="painel-item-left">
                    <span class="painel-item-nome">${item.nome}</span>
                    <span class="painel-item-preco">MZM ${parseFloat(item.preco).toFixed(2)}</span>
                </div>
                <div class="painel-item-right">
                    <div class="qty-control">
                        <button class="qty-btn" onclick="alterarQuantidade(${item.id}, -1)">−</button>
                        <span class="qty-number">${item.quantidade}</span>
                        <button class="qty-btn" onclick="alterarQuantidade(${item.id}, 1)">+</button>
                    </div>
                    <span class="painel-item-subtotal">MZM ${subtotal}</span>
                    <button class="remove-item" onclick="removerDoCarrinho(${item.id})">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
    conteudo.innerHTML = html;

    const subtotal = calcularTotal().toFixed(2);
    const impostos = calcularImpostos(calcularTotal());
    const total = (parseFloat(subtotal) + parseFloat(impostos)).toFixed(2);

    resumo.innerHTML = `
        <div class="painel-resumo-linha"><span>Subtotal</span><span>MZM ${subtotal}</span></div>
        <div class="painel-resumo-linha"><span>Impostos (10%)</span><span>MZM ${impostos}</span></div>
        <div class="painel-resumo-linha total"><span>Total</span><span>MZM ${total}</span></div>
        <a href="checkout.html" class="btn-painel-checkout">Ir para checkout</a>
        <button class="btn-painel-limpar" onclick="limparCarrinho()">🗑️ Limpar Carrinho</button>
    `;
}