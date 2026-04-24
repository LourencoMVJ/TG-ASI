// ===================== NOTIFICAÇÕES =====================
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

// ===================== PAINEL LATERAL =====================
function abrirPainelCarrinho() {
    const painel = document.getElementById('painelCarrinho');
    const overlay = document.getElementById('overlayCarrinho');
    if (painel) painel.classList.add('aberto');
    if (overlay) overlay.classList.add('ativo');
    // garantir que o conteúdo do painel está atualizado
    if (typeof renderizarPainelCarrinho === 'function') renderizarPainelCarrinho();
}

function fecharPainelCarrinho() {
    const painel = document.getElementById('painelCarrinho');
    const overlay = document.getElementById('overlayCarrinho');
    if (painel) painel.classList.remove('aberto');
    if (overlay) overlay.classList.remove('ativo');
}

// Fechar com tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharPainelCarrinho();
});

// ===================== INICIALIZAÇÃO =====================
document.addEventListener('DOMContentLoaded', () => {
    // Carrega dados
    carregarUtilizador();
    carregarProdutos();
    carregarCarrinho();
    recuperarCarrinhoPersistido();

    // Renderiza UI
    atualizarUILogin();
    renderizarProdutos();
    renderizarCarrinho();
    renderizarPainelCarrinho();
    atualizarBadgeCarrinho();

    // Evento do botão "Adicionar Produto" (modal)
    const btn = document.getElementById('btnAdicionarProduto');
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const nome = document.getElementById('nomeProduto').value;
            const preco = document.getElementById('precoProduto').value;
            if (adicionarProduto(nome, preco)) {
                document.getElementById('nomeProduto').value = '';
                document.getElementById('precoProduto').value = '';
                renderizarProdutos();
            }
        });
    }

    // Fechar painel com o botão X dentro do painel
    const btnFecharPainel = document.querySelector('.painel-carrinho-header .btn-fechar');
    if (btnFecharPainel) {
        btnFecharPainel.addEventListener('click', fecharPainelCarrinho);
    }
});