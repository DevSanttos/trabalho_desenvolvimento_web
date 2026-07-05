(function () {
    let lojista = null;
    try {
        lojista = JSON.parse(localStorage.getItem("lojista"));
    } catch (e) {
        lojista = null;
    }

    if (!lojista || !lojista.loja) {
        window.location.href = "../login.html";
        return;
    }

    const nomeLojaEl = document.getElementById("nomeLojaBoasVindas");
    if (nomeLojaEl) {
        nomeLojaEl.textContent = lojista.loja.nome;
    }

    const linkLojaPublica = document.getElementById("linkLojaPublica");
    if (linkLojaPublica && lojista.loja.slug) {
        linkLojaPublica.href = `../loja.html?loja=${lojista.loja.slug}`;
    }

    const sairEl = document.getElementById("btnSair");
    if (sairEl) {
        sairEl.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("lojista");
            window.location.href = "../login.html";
        });
    }
})();
