const API_PRODUTOS = "http://localhost:8080/api/produtos";
const API_BACKEND = "http://localhost:8080";

(function () {
    const form = document.getElementById("produtoForm");
    if (!form) return;

    const lojista = JSON.parse(localStorage.getItem("lojista") || "null");
    if (!lojista || !lojista.loja) return; // o dashboard.js já redireciona nesse caso

    const params = new URLSearchParams(window.location.search);
    const produtoId = params.get("id");
    const ehEdicao = !!produtoId;

    let imagens = [];
    const inputArquivo = document.getElementById("imagemArquivo");

    if (ehEdicao) {
        document.getElementById("tituloPagina").textContent = "Editar produto";
        document.getElementById("btnSalvar").textContent = "Salvar alterações";
        carregarProduto(produtoId);
    }

    inputArquivo.addEventListener("change", async () => {
        const arquivos = Array.from(inputArquivo.files);
        inputArquivo.value = "";
        for (const arquivo of arquivos) {
            try {
                const url = await enviarImagem(arquivo);
                imagens.push(url);
            } catch (err) {
                mostrar("Não foi possível enviar uma das imagens.");
            }
        }
        renderPreviews();
    });

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
            imagens: imagens,
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

    function renderPreviews() {
        const cont = document.getElementById("imagemPreviews");
        cont.innerHTML = "";
        imagens.forEach((url, indice) => {
            const item = document.createElement("div");
            item.className = "preview-item";
            item.innerHTML = `
                <img src="${url}" alt="Foto ${indice + 1}">
                <button type="button" class="preview-remover" title="Remover">&times;</button>`;
            item.querySelector(".preview-remover").addEventListener("click", () => {
                imagens.splice(indice, 1);
                renderPreviews();
            });
            cont.appendChild(item);
        });
    }

    async function carregarProduto(id) {
        try {
            const resp = await fetch(`${API_PRODUTOS}/${id}`);
            if (!resp.ok) {
                mostrar("Produto não encontrado.");
                return;
            }
            const p = await resp.json();
            imagens = p.imagens || [];
            renderPreviews();
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

    async function enviarImagem(arquivo) {
        const dados = new FormData();
        dados.append("arquivo", arquivo);
        const resp = await fetch(`${API_BACKEND}/api/upload`, { method: "POST", body: dados });
        if (!resp.ok) throw new Error("upload falhou");
        const json = await resp.json();
        return API_BACKEND + json.url;
    }

    function mostrar(texto) {
        const el = document.getElementById("produtoMensagem");
        if (el) el.textContent = texto;
    }
})();

function parsePreco(texto) {
    if (!texto) return null;
    let limpo = texto.replace(/[^\d,.]/g, "");
    if (limpo.includes(",")) {
        limpo = limpo.replace(/\./g, "").replace(",", ".");
    }
    const valor = parseFloat(limpo);
    return isNaN(valor) ? null : valor;
}


function formatarPrecoInput(valor) {
    if (valor == null) return "";
    return Number(valor).toFixed(2).replace(".", ",");
}
