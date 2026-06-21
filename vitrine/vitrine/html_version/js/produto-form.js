// Formulário de produto: cria (POST) ou edita (PUT) conforme houver ?id= na URL.
// Carregado nas páginas do dashboard (../js/produto-form.js), após o dashboard.js.

const API_PRODUTOS = "http://localhost:8080/api/produtos";

(function () {
    const form = document.getElementById("produtoForm");
    if (!form) return;

    const lojista = JSON.parse(localStorage.getItem("lojista") || "null");
    if (!lojista || !lojista.loja) return; // o dashboard.js já redireciona nesse caso

    const params = new URLSearchParams(window.location.search);
    const produtoId = params.get("id");
    const ehEdicao = !!produtoId;

    if (ehEdicao) {
        document.getElementById("tituloPagina").textContent = "Editar produto";
        document.getElementById("btnSalvar").textContent = "Salvar alterações";
        carregarProduto(produtoId);
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const preco = parsePreco(document.getElementById("preco").value);
        if (preco === null || preco <= 0) {
            mostrar("Informe um preço válido (ex: 2.499,90).");
            return;
        }

        const payload = {
            lojaId: lojista.loja.id,
            nome: document.getElementById("nome").value.trim(),
            preco: preco,
            descricaoCurta: document.getElementById("descricaoCurta").value.trim(),
            descricaoCompleta: document.getElementById("descricaoCompleta").value.trim(),
            marca: document.getElementById("marca").value.trim(),
            categoria: document.getElementById("categoria").value,
            imagemUrl: document.getElementById("imagemUrl").value.trim(),
            ativo: document.getElementById("ativo").checked,
        };

        const url = ehEdicao ? `${API_PRODUTOS}/${produtoId}` : API_PRODUTOS;
        const metodo = ehEdicao ? "PUT" : "POST";

        try {
            const resp = await fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (resp.ok) {
                window.location.href = "produtos.html";
            } else {
                const dados = await resp.json().catch(() => ({}));
                mostrar(dados.erro || Object.values(dados).join(" ") || "Não foi possível salvar o produto.");
            }
        } catch (err) {
            mostrar("Erro de conexão com o servidor. O backend está rodando?");
        }
    });

    async function carregarProduto(id) {
        try {
            const resp = await fetch(`${API_PRODUTOS}/${id}`);
            if (!resp.ok) {
                mostrar("Produto não encontrado.");
                return;
            }
            const p = await resp.json();
            document.getElementById("imagemUrl").value = p.imagemUrl || "";
            document.getElementById("nome").value = p.nome || "";
            document.getElementById("preco").value = formatarPrecoInput(p.preco);
            document.getElementById("descricaoCurta").value = p.descricaoCurta || "";
            document.getElementById("descricaoCompleta").value = p.descricaoCompleta || "";
            document.getElementById("marca").value = p.marca || "";
            document.getElementById("categoria").value = p.categoria || "";
            document.getElementById("ativo").checked = p.ativo;
        } catch (err) {
            mostrar("Erro ao carregar o produto.");
        }
    }

    function mostrar(texto) {
        const el = document.getElementById("produtoMensagem");
        if (el) el.textContent = texto;
    }
})();

// "2.499,90" ou "2499,90" -> 2499.9 (número). Retorna null se inválido.
function parsePreco(texto) {
    if (!texto) return null;
    let limpo = texto.replace(/[^\d,.]/g, "");
    if (limpo.includes(",")) {
        // formato pt-BR: ponto é milhar, vírgula é decimal
        limpo = limpo.replace(/\./g, "").replace(",", ".");
    }
    const valor = parseFloat(limpo);
    return isNaN(valor) ? null : valor;
}

// 2499.9 -> "2499,90" para preencher o input na edição.
function formatarPrecoInput(valor) {
    if (valor == null) return "";
    return Number(valor).toFixed(2).replace(".", ",");
}
