// ===================== MODAL =====================
function abrirModalAdicionarProduto() {
    if (!ehAdmin()) return;
    const modal = document.getElementById('modalAdicionarProduto');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function fecharModalAdicionarProduto() {
    const modal = document.getElementById('modalAdicionarProduto');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function fecharModalAoClicarFora(event) {
    const modal = document.getElementById('modalAdicionarProduto');
    if (modal && event.target === modal) fecharModalAdicionarProduto();
}

// ===================== PAINEL LATERAL =====================
function abrirPainelCarrinho() {
    const painel = document.getElementById('painelCarrinho');
    const overlay = document.getElementById('overlayCarrinho');
    if (painel) painel.classList.add('aberto');
    if (overlay) overlay.classList.add('ativo');
    renderizarPainelCarrinho();
}

function fecharPainelCarrinho() {
    const painel = document.getElementById('painelCarrinho');
    const overlay = document.getElementById('overlayCarrinho');
    if (painel) painel.classList.remove('aberto');
    if (overlay) overlay.classList.remove('ativo');
}

// ===================== AUTENTICACAO =====================
function fazerLoginFormulario() {
    const username = document.getElementById('inputUsername').value;
    const tipo = document.getElementById('selectTipo').value;
    if (!username || username.trim() === '') {
        alert('Username é obrigatório');
        return;
    }
    login(username.trim(), tipo);
    renderizarLogin();
    renderizarProdutos();
    mostrarNotificacao(`Bem-vindo, ${username.trim()}!`);
}

function fazerLogout() {
    logout();
    renderizarLogin();
    renderizarProdutos();
    mostrarNotificacao('Desconectado com sucesso');
}

// ===================== ACOES DO PRODUTO =====================
function removerProduto(id) {
    if (!ehAdmin()) {
        alert('Acesso negado!');
        return;
    }
    if (!confirm('Remover este produto?')) return;
    const produto = excluirProduto(id);
    if (!produto) return;
    sincronizarCarrinhoComProdutos();
    salvarCarrinho();
    renderizarProdutos();
    renderizarCarrinho();
    renderizarPainelCarrinho();
    mostrarNotificacao('Produto removido');
}

// ===================== ACOES DO CARRINHO =====================
function adicionarAoCarrinho(idProduto) {
    const resultado = adicionarItemCarrinho(idProduto);
    if (!resultado) return;
    mostrarNotificacao(
        resultado.isNew
            ? `${resultado.nome} adicionado ao carrinho!`
            : `${resultado.nome} (Qtd: ${resultado.quantidade})`
    );
    renderizarCarrinho();
    renderizarPainelCarrinho();
}

function removerDoCarrinho(id) {
    const nome = removerItemCarrinho(id);
    if (nome) mostrarNotificacao(`${nome} removido`);
    renderizarCarrinho();
    renderizarPainelCarrinho();
}

function alterarQuantidade(id, delta) {
    alterarQuantidadeCarrinho(id, delta);
    renderizarCarrinho();
    renderizarPainelCarrinho();
}

function limparCarrinho() {
    if (!confirm('Limpar todo o carrinho?')) return;
    esvaziarCarrinho();
    renderizarCarrinho();
    renderizarPainelCarrinho();
    mostrarNotificacao('Carrinho limpado');
}

function finalizarCompra() {
    if (carrinho.length === 0) {
        alert('Carrinho vazio!');
        return;
    }
    const total = calcularTotal().toFixed(2);
    if (confirm(`Finalizar compra no valor de MZN ${total}?`)) {
        esvaziarCarrinho();
        renderizarCarrinho();
        renderizarPainelCarrinho();
        alert('Compra realizada com sucesso!');
    }
}

// ===================== INICIALIZACAO =====================
document.addEventListener('DOMContentLoaded', () => {
    carregarUtilizador();
    carregarProdutos();
    carregarCarrinho();
    recuperarCarrinhoPersistido();

    renderizarLogin();
    renderizarProdutos();
    renderizarCarrinho();
    renderizarPainelCarrinho();
    atualizarBadgeCarrinho();

    const btnAdicionar = document.getElementById('btnAdicionarProduto');
    if (btnAdicionar) {
        btnAdicionar.addEventListener('click', (e) => {
            e.preventDefault();
            if (!ehAdmin()) {
                alert('Apenas administradores podem adicionar produtos!');
                return;
            }
            const nome = document.getElementById('nomeProduto').value;
            const preco = document.getElementById('precoProduto').value;
            const produto = adicionarProduto(nome, preco);
            if (produto) {
                document.getElementById('nomeProduto').value = '';
                document.getElementById('precoProduto').value = '';
                renderizarProdutos();
                fecharModalAdicionarProduto();
                mostrarNotificacao(`"${produto.nome}" adicionado!`);
            }
        });
    }

    const btnFecharPainel = document.querySelector('.painel-carrinho-header .btn-fechar');
    if (btnFecharPainel) {
        btnFecharPainel.addEventListener('click', fecharPainelCarrinho);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') fecharPainelCarrinho();
    });
});
