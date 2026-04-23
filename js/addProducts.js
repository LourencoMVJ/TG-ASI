// ===================== AUTENTICAÇÃO E ADIÇÃO DE PRODUTOS =====================

let utilizadorAtual = null;

// Carrega utilizador da sessionStorage
function carregarUtilizador() {
    const dados = sessionStorage.getItem('utilizadorAtual');
    utilizadorAtual = dados ? JSON.parse(dados) : null;
}

// Faz login
function fazerLogin(username, tipo = 'customer') {
    utilizadorAtual = {
        username: username,
        tipo: tipo  // 'admin' ou 'customer'
    };
    sessionStorage.setItem('utilizadorAtual', JSON.stringify(utilizadorAtual));
    atualizarUILogin();
    mostrarNotificacao(`✅ Bem-vindo, ${username}!`);
}

// Faz logout
function fazerLogout() {
    utilizadorAtual = null;
    sessionStorage.removeItem('utilizadorAtual');
    atualizarUILogin();
    mostrarNotificacao('👋 Desconectado com sucesso');
}

// Verifica se é admin
function ehAdmin() {
    return utilizadorAtual && utilizadorAtual.tipo === 'admin';
}

// Verifica autenticação
function estaAutenticado() {
    return utilizadorAtual !== null;
}

// Atualiza UI baseado no login
function atualizarUILogin() {
    const panelLogin = document.getElementById('painelLogin');
    const botoesAdmin = document.getElementById('botoesAdmin');
    
    if (!panelLogin || !botoesAdmin) return;
    
    if (estaAutenticado()) {
        // Utilizador logado
        panelLogin.innerHTML = `
            <div class="info-usuario">
                <span class="nome-usuario">${utilizadorAtual.username}</span>
                <span class="tipo-usuario">${ehAdmin() ? '👑 Admin' : '👤 Cliente'}</span>
                <button onclick="fazerLogout()" class="btn-logout">Sair</button>
            </div>
        `;
        
        // Mostra/esconde botões de admin
        if (ehAdmin()) {
            botoesAdmin.style.display = 'flex';
            botoesAdmin.innerHTML = `
                <button onclick="abrirModalAdicionarProduto()" class="btn-admin">📦 Adicionar Produto</button>
            `;
        } else {
            botoesAdmin.style.display = 'none';
            botoesAdmin.innerHTML = '';
        }
    } else {
        // Sem login
        panelLogin.innerHTML = `
            <div class="formulario-login">
                <input type="text" id="inputUsername" placeholder="Username" maxlength="20">
                <select id="selectTipo">
                    <option value="customer">Cliente</option>
                    <option value="admin">Admin</option>
                </select>
                <button onclick="fazerLoginFormulario()" class="btn-login">Entrar</button>
            </div>
        `;
        botoesAdmin.style.display = 'none';
        botoesAdmin.innerHTML = '';
    }
}

// Abre modal de adicionar produto
function abrirModalAdicionarProduto() {
    if (!ehAdmin()) return;
    const modal = document.getElementById('modalAdicionarProduto');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Desativa scroll
    }
}

// Fecha modal
function fecharModalAdicionarProduto() {
    const modal = document.getElementById('modalAdicionarProduto');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Ativa scroll
    }
}

// Fecha modal ao clicar fora
function fecharModalAoClicarFora(event) {
    const modal = document.getElementById('modalAdicionarProduto');
    if (modal && event.target === modal) {
        fecharModalAdicionarProduto();
    }
}

// Faz login através do formulário
function fazerLoginFormulario() {
    const username = document.getElementById('inputUsername').value;
    const tipo = document.getElementById('selectTipo').value;
    
    if (!username || username.trim() === '') {
        alert('❌ Username é obrigatório');
        return;
    }
    
    fazerLogin(username.trim(), tipo);
}

// ===================== ADICIONAR PRODUTOS =====================

// Valida nome e preço
function validarProduto(nome, preco) {
    if (!nome || nome.trim() === '') {
        alert('❌ Nome é obrigatório');
        return false;
    }
    
    const precoNum = parseFloat(preco);
    if (isNaN(precoNum) || precoNum <= 0) {
        alert('❌ Preço deve ser um número positivo');
        return false;
    }
    
    // Valida duas casas decimais
    if (!/^\d+(\.\d{1,2})?$/.test(precoNum.toFixed(2))) {
        alert('❌ Preço deve ter no máximo 2 casas decimais');
        return false;
    }
    
    return true;
}

// Adiciona produto (apenas se admin)
function adicionarProduto(nome, preco) {
    if (!ehAdmin()) {
        alert('❌ Apenas administradores podem adicionar produtos!');
        return false;
    }
    
    if (!validarProduto(nome, preco)) return false;
    
    const produto = {
        id: gerarIdProduto(),
        nome: nome.trim(),
        preco: parseFloat(preco).toFixed(2)
    };
    
    produtos.push(produto);
    salvarProdutos();
    mostrarNotificacao(`✅ "${produto.nome}" adicionado!`);
    return true;
}
