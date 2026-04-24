function mostrarNotificacao(mensagem) {
    const toast = document.createElement('div');
    toast.className = 'notificacao';
    toast.textContent = mensagem;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('mostrar'), 10);
    setTimeout(() => {
        toast.classList.remove('mostrar');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

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

function renderizarCarrinho() {
    sincronizarCarrinhoComProdutos();
    const container = document.getElementById('containerCarrinho');
    if (!container) return;

    if (carrinho.length === 0) {
        container.innerHTML = '<div class="vazio">Carrinho vazio</div>';
        renderizarResumo();
        return;
    }

    container.innerHTML = carrinho.map(item => {
        const subtotal = (parseFloat(item.preco) * item.quantidade).toFixed(2);
        return `
            <div class="item-carrinho">
                <div class="item-info">
                    <strong>${item.nome}</strong>
                    <span class="preco">MZN ${parseFloat(item.preco).toFixed(2)}</span>
                </div>
                <div class="item-controles">
                    <button onclick="alterarQuantidade(${item.id}, -1)" class="btn-qtd">−</button>
                    <span class="qtd">${item.quantidade}</span>
                    <button onclick="alterarQuantidade(${item.id}, 1)" class="btn-qtd">+</button>
                </div>
                <div class="item-subtotal">MZN ${subtotal}</div>
                <button onclick="removerDoCarrinho(${item.id})" class="btn-remover">Remover</button>
            </div>
        `;
    }).join('');
    renderizarResumo();
}

function renderizarResumo() {
    const container = document.getElementById('resumoCarrinho');
    if (!container) return;

    const total = calcularTotal().toFixed(2);
    const quantidade = carrinho.reduce((sum, item) => sum + item.quantidade, 0);

    container.innerHTML = `
        <div class="resumo-linha">
            <span>Itens:</span>
            <strong>${quantidade}</strong>
        </div>
        <div class="resumo-linha resumo-total">
            <span>TOTAL:</span>
            <strong>MZN ${total}</strong>
        </div>
        <button onclick="finalizarCompra()" class="btn-finalizar">Finalizar Compra</button>
        <button onclick="limparCarrinho()" class="btn-limpar">Limpar Carrinho</button>
    `;
}

function renderizarPainelCarrinho() {
    const conteudo = document.getElementById('painelCarrinhoConteudo');
    const resumo = document.getElementById('painelCarrinhoResumo');
    if (!conteudo || !resumo) return;

    if (carrinho.length === 0) {
        conteudo.innerHTML = '<div class="painel-carrinho-vazio">Carrinho vazio</div>';
        resumo.innerHTML = '';
        return;
    }

    conteudo.innerHTML = carrinho.map(item => {
        const subtotal = (parseFloat(item.preco) * item.quantidade).toFixed(2);
        return `
            <div class="painel-item">
                <div class="painel-item-left">
                    <span class="painel-item-nome">${item.nome}</span>
                    <span class="painel-item-preco">MZN ${parseFloat(item.preco).toFixed(2)}</span>
                </div>
                <div class="painel-item-right">
                    <div class="qty-control">
                        <button class="qty-btn" onclick="alterarQuantidade(${item.id}, -1)">−</button>
                        <span class="qty-number">${item.quantidade}</span>
                        <button class="qty-btn" onclick="alterarQuantidade(${item.id}, 1)">+</button>
                    </div>
                    <span class="painel-item-subtotal">MZN ${subtotal}</span>
                    <button class="remove-item" onclick="removerDoCarrinho(${item.id})">Remover</button>
                </div>
            </div>
        `;
    }).join('');

    const total = calcularTotal().toFixed(2);
    resumo.innerHTML = `
        <div class="painel-resumo-linha total"><span>Total</span><span>MZN ${total}</span></div>
        <a href="checkout.html" class="btn-painel-checkout">Ir para checkout</a>
        <button class="btn-painel-limpar" onclick="limparCarrinho()">Limpar Carrinho</button>
    `;

    atualizarBadgeCarrinho();
}
