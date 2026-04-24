let carrinho = [];

function carregarCarrinho() {
    const dados = sessionStorage.getItem('carrinho');
    carrinho = dados ? JSON.parse(dados) : [];
}

function salvarCarrinho() {
    sessionStorage.setItem('carrinho', JSON.stringify(carrinho));
    localStorage.setItem('carrinho_backup', JSON.stringify(carrinho));
    localStorage.setItem('carrinho_checkout', JSON.stringify(carrinho));
}

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

function sincronizarCarrinhoComProdutos() {
    if (!produtos || produtos.length === 0) {
        carrinho = [];
        return;
    }
    const idsValidos = produtos.map(p => p.id);
    carrinho = carrinho.filter(item => idsValidos.includes(item.id));
}

function adicionarItemCarrinho(idProduto) {
    const produto = produtos.find(p => p.id === idProduto);
    if (!produto) return null;
    const item = carrinho.find(i => i.id === idProduto);
    if (item) {
        item.quantidade++;
        salvarCarrinho();
        return { nome: item.nome, isNew: false, quantidade: item.quantidade };
    }
    const novoItem = { id: idProduto, nome: produto.nome, preco: produto.preco, quantidade: 1 };
    carrinho.push(novoItem);
    salvarCarrinho();
    return { nome: novoItem.nome, isNew: true, quantidade: 1 };
}

function removerItemCarrinho(id) {
    const item = carrinho.find(i => i.id === id);
    if (!item) return null;
    carrinho = carrinho.filter(i => i.id !== id);
    salvarCarrinho();
    return item.nome;
}

function alterarQuantidadeCarrinho(id, delta) {
    const item = carrinho.find(i => i.id === id);
    if (!item) return null;
    item.quantidade += delta;
    if (item.quantidade <= 0) {
        return removerItemCarrinho(id);
    }
    salvarCarrinho();
    return item;
}

function esvaziarCarrinho() {
    carrinho = [];
    salvarCarrinho();
}

function calcularTotal() {
    return carrinho.reduce((total, item) => total + (parseFloat(item.preco) * item.quantidade), 0);
}
