function renderizarLogin() {
    const panelLogin = document.getElementById('painelLogin');
    const botoesAdmin = document.getElementById('botoesAdmin');
    if (!panelLogin || !botoesAdmin) return;

    if (estaAutenticado()) {
        // Utilizador autenticado
        panelLogin.innerHTML = `
            <div class="info-usuario">
                <span class="nome-usuario">${utilizadorAtual.username}</span>
                <span class="tipo-usuario">${ehAdmin() ? 'Admin' : 'Cliente'}</span>
                <button onclick="fazerLogout()" class="btn-logout">Sair</button>
            </div>
        `;

        // Botões de administrador
        if (ehAdmin()) {
            botoesAdmin.style.display = 'flex';
            botoesAdmin.innerHTML = `
                <button onclick="abrirModalAdicionarProduto()" class="btn-admin">Adicionar Produto</button>
            `;
        } else {
            botoesAdmin.style.display = 'none';
            botoesAdmin.innerHTML = '';
        }

        // Controla visibilidade do ícone do carrinho
        const iconeCarrinho = document.getElementById('iconeCarrinho');
        if (iconeCarrinho) {
            iconeCarrinho.style.display = ehAdmin() ? 'none' : 'flex';
        }
    } else {
        // Sem sessão iniciada
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

        // Mostra ícone do carrinho para visitantes
        const iconeCarrinho = document.getElementById('iconeCarrinho');
        if (iconeCarrinho) {
            iconeCarrinho.style.display = 'flex';
        }
    }
}