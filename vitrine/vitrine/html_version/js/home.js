// Home: lista as cidades com lojas cadastradas (derivadas do backend) e liga a busca.

const API_CIDADES = "http://localhost:8080/api/cidades";
const IMG_CIDADE_PADRAO = "imagens/ibirama.jpg";

(function () {
    const grade = document.getElementById("cidadesGrade");
    const rapidas = document.getElementById("cidadesRapidas");
    const busca = document.getElementById("buscaCidade");
    const botao = document.getElementById("botaoExplorar");

    let cidades = [];

    carregar();

    // Busca: filtra a grade ao digitar.
    if (busca) {
        busca.addEventListener("input", () => render(busca.value.trim().toLowerCase()));
    }
    // Explorar: vai direto para a cidade digitada.
    if (botao) {
        botao.addEventListener("click", () => {
            const termo = (busca?.value || "").trim();
            if (!termo) return;
            const slug = slugify(termo);
            window.location.href = `cidade.html?cidade=${slug}`;
        });
    }

    async function carregar() {
        try {
            const resp = await fetch(API_CIDADES);
            cidades = resp.ok ? await resp.json() : [];
        } catch (err) {
            cidades = [];
        }
        render("");
        renderRapidas();
    }

    function render(filtro) {
        if (!grade) return;
        const lista = filtro ? cidades.filter((c) => c.nome.toLowerCase().includes(filtro)) : cidades;
        if (lista.length === 0) {
            grade.innerHTML = `<p style="color:var(--vl-secundario)">Nenhuma cidade com lojas cadastradas ainda.</p>`;
            return;
        }
        grade.innerHTML = lista.map((c) => `
            <div class="cidade-cartao">
                <img src="${IMG_CIDADE_PADRAO}" alt="${esc(c.nome)}" class="cidade-cartao__imagem">
                <div class="cidade-cartao__corpo">
                    <h3 class="cidade-cartao__nome">${esc(c.nome)}</h3>
                    <p class="cidade-cartao__total">${c.totalLojas} loja${c.totalLojas === 1 ? "" : "s"} cadastrada${c.totalLojas === 1 ? "" : "s"}</p>
                    <a href="cidade.html?cidade=${esc(c.slug)}" class="botao-ver-cidade">Ver lojas</a>
                </div>
            </div>`).join("");
    }

    function renderRapidas() {
        if (!rapidas) return;
        rapidas.innerHTML = cidades.slice(0, 4).map((c) => `
            <a href="cidade.html?cidade=${esc(c.slug)}" class="cartao-cidade-rapida">
                <img src="${IMG_CIDADE_PADRAO}" alt="${esc(c.nome)}" class="cartao-cidade-rapida__imagem">
                <h3>${esc(c.nome)}</h3>
                <p>${c.totalLojas} loja${c.totalLojas === 1 ? "" : "s"}</p>
            </a>`).join("");
    }

    function slugify(texto) {
        return texto.normalize("NFD").replace(/[̀-ͯ]/g, "")
            .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-+)|(-+$)/g, "");
    }

    function esc(t) {
        return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
})();
