// Página de detalhe do produto: lê ?id= da URL, carrega o produto e a loja.

const API_PRODUTO_DET = "http://localhost:8080/api/produtos";
const API_LOJA_DET = "http://localhost:8080/api/lojas";

const moedaProd = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

(function () {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) {
        document.getElementById("prodTitulo").textContent = "Produto não informado";
        return;
    }

    carregar();

    async function carregar() {
        let produto;
        try {
            const resp = await fetch(`${API_PRODUTO_DET}/${id}`);
            if (!resp.ok) {
                document.getElementById("prodTitulo").textContent = "Produto não encontrado";
                return;
            }
            produto = await resp.json();
        } catch (err) {
            document.getElementById("prodTitulo").textContent = "Erro de conexão";
            return;
        }

        const cat = produto.categoria || "";
        document.title = `${produto.nome} - VitrineLocal`;
        // Sem foto (ou link quebrado): usa uma imagem transparente — fundo cinza claro.
        const transparente = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        const imagem = produto.imagemUrl || transparente;
        const imgPrincipal = document.getElementById("prodImagem");
        const imgMini = document.getElementById("prodMiniatura");
        imgPrincipal.onerror = () => { imgPrincipal.onerror = null; imgPrincipal.src = transparente; };
        imgMini.onerror = () => { imgMini.onerror = null; imgMini.src = transparente; };
        imgPrincipal.src = imagem;
        imgMini.src = imagem;
        document.getElementById("prodCategoria").textContent = cat;
        document.getElementById("prodCategoriaEspec").textContent = cat;
        document.getElementById("prodTitulo").textContent = produto.nome;
        document.getElementById("prodPreco").textContent = moedaProd.format(produto.preco);
        document.getElementById("prodDescricao").textContent =
            produto.descricaoCompleta || produto.descricaoCurta || "";
        document.getElementById("prodMarca").textContent = produto.marca || "—";

        // Links de voltar e caminho usam a loja do produto.
        const linkLoja = `loja.html?loja=${produto.lojaSlug}`;
        document.getElementById("prodVoltar").href = linkLoja;
        document.getElementById("prodFechar").href = linkLoja;
        document.getElementById("prodVoltar").lastChild.textContent = ` Voltar para ${produto.lojaNome}`;
        document.getElementById("prodCaminho").textContent = `${produto.lojaNome} / ${produto.nome}`;

        ligarWhatsapp(produto.lojaSlug, produto.nome);
    }

    // Busca o WhatsApp da loja para o botão de contato.
    async function ligarWhatsapp(slug, nomeProduto) {
        const botao = document.getElementById("btnWhatsappProduto");
        try {
            const resp = await fetch(`${API_LOJA_DET}/${slug}`);
            if (!resp.ok) return;
            const loja = await resp.json();
            const numero = (loja.whatsapp || "").replace(/\D/g, "");
            if (!numero) {
                botao.disabled = true;
                return;
            }
            const msg = encodeURIComponent(`Olá! Tenho interesse no produto "${nomeProduto}".`);
            botao.addEventListener("click", () => {
                window.open(`https://wa.me/55${numero}?text=${msg}`, "_blank");
            });
        } catch (err) {
            /* silencioso */
        }
    }
})();
