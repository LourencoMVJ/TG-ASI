// -------------------- modelo (carrinho) --------------------
// estrutura do item: { id, nome, preco, quantidade }
let itensCarrinho = [];

// carregar carrinho do armazenamento local (agora sem dados de exemplo)
function carregarCarrinho() {
    const dados = localStorage.getItem('carrinho_checkout');
    if (dados) {
        try {
            itensCarrinho = JSON.parse(dados);
        } catch(e) {
            itensCarrinho = [];
        }
    }
    
}

function salvarCarrinho() {
    localStorage.setItem('carrinho_checkout', JSON.stringify(itensCarrinho));
}

// -------------------- calculos --------------------
function obterQuantidadeTotal() {
    return itensCarrinho.reduce((soma, item) => soma + item.quantidade, 0);
}

function obterValorTotal() {
    return itensCarrinho.reduce((soma, item) => soma + (parseFloat(item.preco) * item.quantidade), 0);
}

// -------------------- visualizacão (SEM botões de edição) --------------------
function renderizarCheckout() {
    const container = document.getElementById('cart-items-list');
    const totalQtSpan = document.getElementById('total-quantity');
    const totalValorSpan = document.getElementById('total-price');

    if (!container) return;

    if (itensCarrinho.length === 0) {
        container.innerHTML = `<div class="empty-message">carrinho vazio. adicione produtos para finalizar a compra.</div>`;
    } else {
        const htmlItens = itensCarrinho.map(item => {
            // Garantir que o preço é número
            const precoNum = parseFloat(item.preco);
            const subtotal = precoNum * item.quantidade;
            return `
                <div class="cart-item" data-id="${item.id}">
                    <div class="item-info">
                        <div class="item-name">${escapeHtml(item.nome)}</div>
                        <div class="item-price">MZN ${precoNum.toFixed(2)}</div>
                    </div>
                    <div class="item-controls">
                        <div class="qty-control">
                            <span class="qty-number">${item.quantidade}</span>
                        </div>
                        <div class="subtotal">MZN ${subtotal.toFixed(2)}</div>
                    </div>
                </div>
            `;
        }).join('');
        container.innerHTML = htmlItens;
    }

    if (totalQtSpan) totalQtSpan.innerText = obterQuantidadeTotal();
    if (totalValorSpan) totalValorSpan.innerText = `MZN ${obterValorTotal().toFixed(2)}`;
}

// seguranca basica contra xss
function escapeHtml(texto) {
    if (!texto) return '';
    return texto.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// -------------------- accoes do utilizador (sem alteração) --------------------
function finalizarCompra() {
    if (itensCarrinho.length === 0) {
        alert("carrinho vazio. adicione produtos para encerrar a compra.");
        return;
    }
    if (confirm("confirmar finalizacao da compra? o carrinho sera esvaziado.")) {
        sessionStorage.removeItem('carrinho');
        localStorage.removeItem('carrinho_backup');
        localStorage.removeItem('carrinho_checkout');

        itensCarrinho = [];
        renderizarCheckout();
        alert("compra finalizada com sucesso. obrigado.");
        window.location.href = 'index.html';
    }
}

// Removidas as funções alterarQuantidade(), removerItem() e a delegação de eventos,
// pois não há mais botões de ação.

function configurarBotaoFinalizar() {
    const botao = document.getElementById('finalize-checkout-btn');
    if (botao) botao.addEventListener('click', finalizarCompra);
}

function configurarBotaoContinuar() {
    const botao = document.getElementById('continue-shopping-btn');
    if (botao) {
        botao.addEventListener('click', () => {
            if (confirm("voltar a loja? o carrinho atual sera mantido.")) {
                window.location.href = "index.html";
            }
        });
    }
}

// -------------------- inicializacão --------------------
function iniciar() {
    carregarCarrinho();
    renderizarCheckout();
    // NÃO associamos eventos de clique para +, -, remover
    configurarBotaoFinalizar();
    configurarBotaoContinuar();
}

document.addEventListener('DOMContentLoaded', iniciar);