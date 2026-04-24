function renderizarLogin() {
    const panelLogin = document.getElementById('painelLogin');
    const botoesAdmin = document.getElementById('botoesAdmin');
    if (!panelLogin || !botoesAdmin) return;

    if (estaAutenticado()) {
        panelLogin.innerHTML = `
            <div class="info-usuario">
                <span class="nome-usuario">${utilizadorAtual.username}</span>
                <span class="tipo-usuario">${ehAdmin() ? 'Admin' : 'Cliente'}</span>
                <button onclick="fazerLogout()" class="btn-logout">Sair</button>
            </div>
        `;
        if (ehAdmin()) {
            botoesAdmin.style.display = 'flex';
            botoesAdmin.innerHTML = `
                <button onclick="abrirModalAdicionarProduto()" class="btn-admin">Adicionar Produto</button>
            `;
        } else {
            botoesAdmin.style.display = 'none';
            botoesAdmin.innerHTML = '';
        }
    } else {
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
