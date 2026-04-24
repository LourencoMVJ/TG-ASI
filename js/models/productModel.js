let produtos = [];

function carregarProdutos() {
    const dados = localStorage.getItem('produtos');
    produtos = dados ? JSON.parse(dados) : [];
}

function salvarProdutos() {
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

function gerarIdProduto() {
    return produtos.length ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
}

function validarProduto(nome, preco) {
    if (!nome || nome.trim() === '') {
        alert('Nome é obrigatório');
        return false;
    }
    const precoNum = parseFloat(preco);
    if (isNaN(precoNum) || precoNum <= 0) {
        alert('Preço deve ser um número positivo');
        return false;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(precoNum.toFixed(2))) {
        alert('Preço deve ter no máximo 2 casas decimais');
        return false;
    }
    return true;
}

function adicionarProduto(nome, preco) {
    if (!validarProduto(nome, preco)) return null;
    const produto = {
        id: gerarIdProduto(),
        nome: nome.trim(),
        preco: parseFloat(preco).toFixed(2)
    };
    produtos.push(produto);
    salvarProdutos();
    return produto;
}

function excluirProduto(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return null;
    produtos = produtos.filter(p => p.id !== id);
    salvarProdutos();
    return produto;
}
