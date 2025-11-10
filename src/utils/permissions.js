function permissions(role) {
    const permissoes = {
        admin: ['dashboard', 'consultas', 'usuarios', 'consultaform'],
        medico: ['dashboard', 'consultas', ''],
        recepcionista: ['dashboard']
    };
    return permissoes[role] || [];
}

function pode(role, acao) {
    const permissoesRole = permissions(role);
    return permissoesRole.includes(acao);
}