let utilizadorAtual = null;

function carregarUtilizador() {
    const dados = sessionStorage.getItem('utilizadorAtual');
    utilizadorAtual = dados ? JSON.parse(dados) : null;
}

function login(username, tipo) {
    utilizadorAtual = { username: username, tipo: tipo };
    sessionStorage.setItem('utilizadorAtual', JSON.stringify(utilizadorAtual));
}

function logout() {
    utilizadorAtual = null;
    sessionStorage.removeItem('utilizadorAtual');
}

function ehAdmin() {
    return utilizadorAtual && utilizadorAtual.tipo === 'admin';
}

function estaAutenticado() {
    return utilizadorAtual !== null;
}
