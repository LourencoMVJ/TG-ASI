// ===================== NOTIFICAÇÕES =====================

// Notificação visual rápida
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
    
    // Evento formulário de adicionar produto
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
});
