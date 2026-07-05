const API_PRODUTOS_LISTA = "http://localhost:8080/api/produtos";

const moedaBR = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const SEM_IMAGEM = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

(function () {
    const tbody = document.getElementById("tabelaProdutosBody");
    if (!tbody) return;

    const lojista = JSON.parse(localStorage.getItem("lojista") || "null");
    if (!lojista || !lojista.loja) return;

    let produtos = [];
    let filtroStatus = "todos";
    let termoBusca = "";

    carregar();

    document.getElementById("campoBusca").addEventListener("input", (e) => {
        termoBusca = e.target.value.trim().toLowerCase();
        render();
    });

    document.querySelectorAll(".filtro-botao").forEach((botao) => {
        botao.addEventListener("click", () => {
            document.querySelectorAll(".filtro-botao").forEach((b) => b.classList.remove("filtro-botao--ativo"));
            botao.classList.add("filtro-botao--ativo");
            filtroStatus = botao.dataset.filtro;
            render();
        });
    });

    async function carregar() {
        try {
            const resp = await fetch(`${API_PRODUTOS_LISTA}?lojaId=${lojista.loja.id}`);
            produtos = resp.ok ? await resp.json() : [];
        } catch (err) {
            produtos = [];
        }
        atualizarEstatisticas();
        render();
    }

    function atualizarEstatisticas() {
        const ativos = produtos.filter((p) => p.ativo).length;
        const totalViews = produtos.reduce((soma, p) => soma + (p.visualizacoes || 0), 0);
        document.getElementById("statTotal").textContent = produtos.length;
        document.getElementById("statAtivos").textContent = ativos;
        document.getElementById("statInativos").textContent = produtos.length - ativos;
        document.getElementById("statVisualizacoes").textContent = totalViews;
        document.getElementById("subtituloContagem").textContent =
            `${produtos.length} produto${produtos.length === 1 ? "" : "s"} cadastrado${produtos.length === 1 ? "" : "s"}`;
    }

    function render() {
        let lista = produtos;
        if (filtroStatus === "ativos") lista = lista.filter((p) => p.ativo);
        if (filtroStatus === "inativos") lista = lista.filter((p) => !p.ativo);
        if (termoBusca) lista = lista.filter((p) => p.nome.toLowerCase().includes(termoBusca));

        if (lista.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--vl-secundario)">Nenhum produto encontrado.</td></tr>`;
            return;
        }

        tbody.innerHTML = lista.map((p) => linha(p)).join("");
        if (window.lucide) lucide.createIcons();
        ligarAcoes();
    }

    function linha(p) {
        const img = p.imagemUrl ? esc(p.imagemUrl) : SEM_IMAGEM;
        const categoria = p.categoria || "";
        const etiqueta = p.ativo
            ? `<span class="etiqueta etiqueta-aberto">Ativo</span>`
            : `<span class="etiqueta etiqueta-padrao">Inativo</span>`;
        return `
            <tr>
                <td>
                    <div class="tabela-produto-celula">
                        <img src="${img}" alt="${esc(p.nome)}" class="miniatura-produto">
                        <span>${esc(p.nome)}</span>
                    </div>
                </td>
                <td>${esc(categoria)}</td>
                <td>${moedaBR.format(p.preco)}</td>
                <td>${p.visualizacoes}</td>
                <td>${etiqueta}</td>
                <td>
                    <div class="tabela-acoes">
                        <button class="botao-icone" title="Visualizar" data-acao="ver" data-id="${p.id}"><i data-lucide="eye" class="icone-xs"></i></button>
                        <button class="botao-icone" title="Editar" data-acao="editar" data-id="${p.id}"><i data-lucide="pencil" class="icone-xs"></i></button>
                        <button class="botao-icone" title="Excluir" data-acao="excluir" data-id="${p.id}"><i data-lucide="trash-2" class="icone-xs"></i></button>
                    </div>
                </td>
            </tr>`;
    }

    function ligarAcoes() {
        tbody.querySelectorAll("[data-acao]").forEach((botao) => {
            const id = botao.dataset.id;
            const acao = botao.dataset.acao;
            botao.addEventListener("click", () => {
                if (acao === "ver") {
                    window.open(`../loja.html?loja=${lojista.loja.slug}`, "_blank");
                } else if (acao === "editar") {
                    window.location.href = `produtos-novo.html?id=${id}`;
                } else if (acao === "excluir") {
                    excluir(id);
                }
            });
        });
    }

    async function excluir(id) {
        const produto = produtos.find((p) => p.id === id);
        if (!confirm(`Excluir o produto "${produto ? produto.nome : ""}"?`)) return;
        try {
            const resp = await fetch(`${API_PRODUTOS_LISTA}/${id}`, { method: "DELETE" });
            if (resp.ok) {
                carregar();
            } else {
                alert("Não foi possível excluir o produto.");
            }
        } catch (err) {
            alert("Erro de conexão com o servidor.");
        }
    }

    function esc(texto) {
        return String(texto)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }
})();
