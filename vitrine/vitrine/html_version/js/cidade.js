// Página da cidade: lista as lojas daquela cidade (slug na URL), com busca e
// filtro de categoria no cliente.

const API_CIDADES_PUB = "http://localhost:8080/api/cidades";

const CATEGORIA_LOJA_LABEL = {
    moveis: "Móveis",
    decoracao: "Decoração",
    roupas: "Roupas",
    alimentos: "Alimentos",
    eletronicos: "Eletrônicos",
};

(function () {
    const grade = document.getElementById("lojasGrade");
    if (!grade) return;

    const slug = new URLSearchParams(window.location.search).get("cidade");
    if (!slug) {
        document.getElementById("cidadeNome").textContent = "Cidade não informada";
        grade.innerHTML = `<p style="color:var(--vl-secundario)">Volte à home e escolha uma cidade.</p>`;
        return;
    }

    let lojas = [];
    let categoriaAtual = "todos";
    let termoBusca = "";

    carregar();

    document.getElementById("buscaLoja").addEventListener("input", (e) => {
        termoBusca = e.target.value.trim().toLowerCase();
        render();
    });

    async function carregar() {
        try {
            const resp = await fetch(`${API_CIDADES_PUB}/${slug}/lojas`);
            lojas = resp.ok ? await resp.json() : [];
        } catch (err) {
            lojas = [];
        }

        // Nome da cidade vem do campo das lojas; stats calculados.
        const nomeCidade = lojas.length ? lojas[0].cidade : slug;
        document.getElementById("cidadeNome").textContent = nomeCidade;
        document.getElementById("statLojas").textContent = lojas.length;
        document.getElementById("statProdutos").textContent =
            lojas.reduce((s, l) => s + (l.totalProdutos || 0), 0);
        const categorias = [...new Set(lojas.map((l) => l.categoria).filter(Boolean))];
        document.getElementById("statCategorias").textContent = categorias.length;

        montarCategorias(categorias);
        render();
    }

    function montarCategorias(categorias) {
        const ul = document.getElementById("categoriaLista");
        const itens = [`<li><button class="categoria-lista__item categoria-lista__item--ativo" data-cat="todos">Todos (${lojas.length})</button></li>`];
        categorias.forEach((cat) => {
            const qtd = lojas.filter((l) => l.categoria === cat).length;
            const label = CATEGORIA_LOJA_LABEL[cat] || cat;
            itens.push(`<li><button class="categoria-lista__item" data-cat="${esc(cat)}">${esc(label)} (${qtd})</button></li>`);
        });
        ul.innerHTML = itens.join("");

        ul.querySelectorAll(".categoria-lista__item").forEach((botao) => {
            botao.addEventListener("click", () => {
                ul.querySelectorAll(".categoria-lista__item").forEach((b) => b.classList.remove("categoria-lista__item--ativo"));
                botao.classList.add("categoria-lista__item--ativo");
                categoriaAtual = botao.dataset.cat;
                render();
            });
        });
    }

    function render() {
        let lista = lojas;
        if (categoriaAtual !== "todos") lista = lista.filter((l) => l.categoria === categoriaAtual);
        if (termoBusca) lista = lista.filter((l) => l.nome.toLowerCase().includes(termoBusca));

        if (lista.length === 0) {
            grade.innerHTML = `<p style="color:var(--vl-secundario)">Nenhuma loja encontrada.</p>`;
            return;
        }

        grade.innerHTML = lista.map((l) => {
            const label = CATEGORIA_LOJA_LABEL[l.categoria] || l.categoria || "";
            return `
            <a href="loja.html?loja=${esc(l.slug)}" class="cartao-loja">
                <div class="cartao-loja__logo">
                    <img src="imagens/logo-loja-moveis.webp" alt="${esc(l.nome)}">
                </div>
                <div class="cartao-loja__nome">${esc(l.nome)}</div>
                <div class="cartao-loja__categoria">${esc(label)}</div>
                <div class="cartao-loja__endereco">${esc(l.endereco || "")}</div>
                <div class="cartao-loja__rodape">
                    <span class="cartao-loja__produtos">${l.totalProdutos} produto${l.totalProdutos === 1 ? "" : "s"}</span>
                    <span class="etiqueta etiqueta-aberto">Aberto</span>
                </div>
                <span class="botao-ver-loja">Ver loja</span>
            </a>`;
        }).join("");
        if (window.lucide) lucide.createIcons();
    }

    function esc(t) {
        return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
})();
