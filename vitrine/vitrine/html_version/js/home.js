(function () {
    const busca = document.getElementById("buscaCidade");
    const botao = document.getElementById("botaoExplorar");

    function explorar() {
        const termo = (busca?.value || "").trim();
        if (!termo) return;
        window.location.href = `cidade.html?cidade=${slugify(termo)}&nome=${encodeURIComponent(termo)}`;
    }

    if (botao) botao.addEventListener("click", explorar);
    if (busca) {
        busca.addEventListener("keydown", (e) => {
            if (e.key === "Enter") explorar();
        });
    }

    function slugify(texto) {
        return texto.normalize("NFD").replace(/[̀-ͯ]/g, "")
            .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-+)|(-+$)/g, "");
    }
})();
