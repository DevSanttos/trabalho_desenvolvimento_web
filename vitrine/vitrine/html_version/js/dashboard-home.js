const API_PRODUTOS_HOME = "http://localhost:8080/api/produtos";

const moedaHome = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const SEM_IMAGEM_HOME = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

(function () {
    const lojista = JSON.parse(localStorage.getItem("lojista") || "null");
    if (!lojista || !lojista.loja) return;

    carregar();

    async function carregar() {
        let produtos = [];
        try {
            const resp = await fetch(`${API_PRODUTOS_HOME}?lojaId=${lojista.loja.id}`);
            produtos = resp.ok ? await resp.json() : [];
        } catch (err) {
            produtos = [];
        }

        // Estatísticas
        const totalViews = produtos.reduce((s, p) => s + (p.visualizacoes || 0), 0);
        const categorias = new Set(produtos.filter((p) => p.ativo).map((p) => p.categoria));
        setText("homeTotalProdutos", produtos.length);
        setText("homeVisualizacoes", totalViews.toLocaleString("pt-BR"));
        setText("homeCategorias", categorias.size);

        renderPopulares(produtos);
        renderTabela(produtos);
        if (window.lucide) lucide.createIcons();
    }

    function renderPopulares(produtos) {
        const cont = document.getElementById("produtosPopulares");
        if (!cont) return;
        const top = [...produtos].sort((a, b) => b.visualizacoes - a.visualizacoes).slice(0, 3);
        if (top.length === 0) {
            cont.innerHTML = `<p style="color:var(--vl-secundario)">Nenhum produto ainda.</p>`;
            return;
        }
        cont.innerHTML = top.map((p) => `
            <div class="produto-popular-linha">
                <div class="produto-popular-informacao">
                    <img src="${p.imagemUrl ? esc(p.imagemUrl) : SEM_IMAGEM_HOME}" alt="${esc(p.nome)}" class="miniatura-produto">
                    <div>
                        <p class="produto-popular-nome">${esc(p.nome)}</p>
                        <p class="produto-popular-visualizacoes">${p.visualizacoes} visualizações</p>
                    </div>
                </div>
                <span class="produto-popular-preco">${moedaHome.format(p.preco)}</span>
            </div>`).join("");
    }

    function renderTabela(produtos) {
        const tbody = document.getElementById("tabelaResumoBody");
        if (!tbody) return;
        const recentes = produtos.slice(0, 5);
        if (recentes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:16px;color:var(--vl-secundario)">Nenhum produto cadastrado.</td></tr>`;
            return;
        }
        tbody.innerHTML = recentes.map((p) => {
            const cat = p.categoria || "";
            const etiqueta = p.ativo
                ? `<span class="etiqueta etiqueta-aberto">Ativo</span>`
                : `<span class="etiqueta etiqueta-padrao">Inativo</span>`;
            return `
                <tr>
                    <td>${esc(p.nome)}</td>
                    <td>${esc(cat)}</td>
                    <td>${moedaHome.format(p.preco)}</td>
                    <td>${etiqueta}</td>
                    <td>
                        <div class="tabela-acoes">
                            <button class="botao-icone" title="Visualizar" data-acao="ver" data-id="${p.id}"><i data-lucide="eye" class="icone-xs"></i></button>
                            <button class="botao-icone" title="Editar" data-acao="editar" data-id="${p.id}"><i data-lucide="pencil" class="icone-xs"></i></button>
                            <button class="botao-icone" title="Excluir" data-acao="excluir" data-id="${p.id}"><i data-lucide="trash-2" class="icone-xs"></i></button>
                        </div>
                    </td>
                </tr>`;
        }).join("");
        ligarAcoes(tbody);
    }

    function ligarAcoes(tbody) {
        const botoes = tbody.querySelectorAll("[data-acao]");
        for (let i = 0; i < botoes.length; i++) {
            const botao = botoes[i];
            botao.addEventListener("click", () => {
                const id = botao.dataset.id;
                const acao = botao.dataset.acao;
                if (acao === "ver") {
                    window.open(`../loja.html?loja=${lojista.loja.slug}`, "_blank");
                } else if (acao === "editar") {
                    window.location.href = `produtos-novo.html?id=${id}`;
                } else if (acao === "excluir") {
                    excluir(id);
                }
            });
        }
    }

    async function excluir(id) {
        if (!confirm("Excluir este produto?")) return;
        try {
            const resp = await fetch(`${API_PRODUTOS_HOME}/${id}`, { method: "DELETE" });
            if (resp.ok) {
                carregar();
            } else {
                alert("Não foi possível excluir o produto.");
            }
        } catch (err) {
            alert("Erro de conexão com o servidor.");
        }
    }

    function setText(id, valor) {
        const el = document.getElementById(id);
        if (el) el.textContent = valor;
    }

    function esc(t) {
        return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
})();
