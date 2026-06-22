// Home: as cidades em destaque são fixas no HTML. Aqui só ligamos a busca:
// ao clicar em "Explorar" (ou apertar Enter), vai para a página da cidade digitada.

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

    // "São Paulo" -> "sao-paulo"
    function slugify(texto) {
        return texto.normalize("NFD").replace(/[̀-ͯ]/g, "")
            .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-+)|(-+$)/g, "");
    }
})();
