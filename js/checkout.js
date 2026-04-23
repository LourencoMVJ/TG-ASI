// -------------------- modelo (carrinho) --------------------
// estrutura do item: { id, nome, preco, quantidade }
let itensCarrinho = [];

// carregar carrinho do armazenamento local
function carregarCarrinho() {
    const dados = localStorage.getItem('carrinho_checkout');
    if (dados) {
        try {
            itensCarrinho = JSON.parse(dados);
        } catch(e) { itensCarrinho = []; }
    }
    // se vazio, adiciona produtos de exemplo
    if (!itensCarrinho || itensCarrinho.length === 0) {
        itensCarrinho = [
            { id: 1, nome: "Camisa", preco: 250.00, quantidade: 2 },
            { id: 2, nome: "Calca Jeans", preco: 1500.00, quantidade: 1 },
            { id: 3, nome: "Sapatilha", preco: 3400.00, quantidade: 1 },
            { id: 4, nome: "Chapeu", preco: 350.00, quantidade: 3 }
        ];
        salvarCarrinho();
    }
}

function salvarCarrinho() {
    localStorage.setItem('carrinho_checkout', JSON.stringify(itensCarrinho));
}

// -------------------- calculos (foco: total de produtos e valor total) --------------------
function obterQuantidadeTotal() {
    return itensCarrinho.reduce((soma, item) => soma + item.quantidade, 0);
}

function obterValorTotal() {
    return itensCarrinho.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);
}

// -------------------- visualizacao e eventos --------------------
function renderizarCheckout() {
    const container = document.getElementById('cart-items-list');
    const totalQtSpan = document.getElementById('total-quantity');
    const totalValorSpan = document.getElementById('total-price');

    if (!container) return;

    if (itensCarrinho.length === 0) {
        container.innerHTML = `<div class="empty-message">carrinho vazio. adicione produtos para finalizar a compra.</div>`;
    } else {
        const htmlItens = itensCarrinho.map(item => {
            const subtotal = item.preco * item.quantidade;
            return `
                <div class="cart-item" data-id="${item.id}">
                    <div class="item-info">
                        <div class="item-name">${escapeHtml(item.nome)}</div>
                        <div class="item-price">MZN ${item.preco.toFixed(2)}</div>
                    </div>
                    <div class="item-controls">
                        <div class="qty-control">
                            <button class="qty-btn dec" data-id="${item.id}">-</button>
                            <span class="qty-number">${item.quantidade}</span>
                            <button class="qty-btn inc" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}">remover</button>
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

// -------------------- accoes do utilizador --------------------
function actualizarInterface() {
    salvarCarrinho();
    renderizarCheckout();
}

function alterarQuantidade(idProduto, delta) {
    const indice = itensCarrinho.findIndex(item => item.id === idProduto);
    if (indice !== -1) {
        const novaQt = itensCarrinho[indice].quantidade + delta;
        if (novaQt <= 0) {
            itensCarrinho.splice(indice, 1);
        } else {
            itensCarrinho[indice].quantidade = novaQt;
        }
        actualizarInterface();
    }
}

function removerItem(idProduto) {
    itensCarrinho = itensCarrinho.filter(item => item.id !== idProduto);
    actualizarInterface();
}

function finalizarCompra() {
    if (itensCarrinho.length === 0) {
        alert("carrinho vazio. adicione produtos para encerrar a compra.");
        return;
    }
    if (confirm("confirmar finalizacao da compra? o carrinho sera esvaziado.")) {
        itensCarrinho = [];
        salvarCarrinho();
        renderizarCheckout();
        alert("compra finalizada com sucesso. obrigado.");
    }
}

// delegacao de eventos para botoes dinamicos (+ , - , remover)
function associarEventosDelegados() {
    const container = document.getElementById('cart-items-list');
    if (!container) return;

    container.addEventListener('click', (e) => {
        const botao = e.target;
        if (botao.classList.contains('inc')) {
            const id = parseInt(botao.getAttribute('data-id'));
            if (id) alterarQuantidade(id, 1);
        }
        else if (botao.classList.contains('dec')) {
            const id = parseInt(botao.getAttribute('data-id'));
            if (id) alterarQuantidade(id, -1);
        }
        else if (botao.classList.contains('remove-item')) {
            const id = parseInt(botao.getAttribute('data-id'));
            if (id) removerItem(id);
        }
    });
}

function configurarBotaoFinalizar() {
    const botao = document.getElementById('finalize-checkout-btn');
    if (botao) botao.addEventListener('click', finalizarCompra);
}

function configurarBotaoContinuar() {
    const botao = document.getElementById('continue-shopping-btn');
    if (botao) {
        botao.addEventListener('click', () => {
            if (confirm("voltar a loja? o carrinho atual sera mantido.")) {
                alert("redirecionar para pagina de produtos. por enquanto o carrinho continua o mesmo.");
                window.location.href = "index.html";
            }
        });
    }
}

// -------------------- inicializacao --------------------
function iniciar() {
    carregarCarrinho();
    renderizarCheckout();
    associarEventosDelegados();
    configurarBotaoFinalizar();
    configurarBotaoContinuar();
}

document.addEventListener('DOMContentLoaded', iniciar);