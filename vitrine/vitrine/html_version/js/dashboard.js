// Protege as páginas do dashboard e personaliza com os dados da loja logada.
// É carregado em todas as páginas de dashboard/ (caminho relativo ../js/dashboard.js).

(function () {
    // Recupera o lojista salvo no login.
    let lojista = null;
    try {
        lojista = JSON.parse(localStorage.getItem("lojista"));
    } catch (e) {
        lojista = null;
    }

    // Guard: sem login (ou sem loja vinculada) volta para a tela de login.
    if (!lojista || !lojista.loja) {
        window.location.href = "../login.html";
        return;
    }

    // Preenche "Bem-vindo de volta, {nome da loja}" — só onde o elemento existe.
    const nomeLojaEl = document.getElementById("nomeLojaBoasVindas");
    if (nomeLojaEl) {
        nomeLojaEl.textContent = lojista.loja.nome;
    }

    // Botão "Sair" (se existir): limpa a sessão e volta ao login.
    const sairEl = document.getElementById("btnSair");
    if (sairEl) {
        sairEl.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("lojista");
            window.location.href = "../login.html";
        });
    }
})();
