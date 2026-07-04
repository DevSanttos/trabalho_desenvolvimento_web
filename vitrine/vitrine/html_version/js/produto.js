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
        montarGaleria(produto.imagens || []);
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

    // Monta a galeria: imagem principal + miniaturas + setas.
    function montarGaleria(imagens) {
        const transparente = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        const imgPrincipal = document.getElementById("prodImagem");
        const miniaturas = document.getElementById("prodMiniaturas");

        // Sem fotos: mostra o quadrado cinza e some com miniaturas/setas.
        if (imagens.length === 0) {
            imgPrincipal.src = transparente;
            miniaturas.innerHTML = "";
            esconderSetas();
            return;
        }

        let atual = 0;
        function mostrar(indice) {
            atual = indice;
            imgPrincipal.src = imagens[indice];
            // marca a miniatura ativa
            const minis = miniaturas.querySelectorAll(".galeria__miniatura");
            minis.forEach((m, i) => m.classList.toggle("galeria__miniatura--ativa", i === indice));
        }

        // Cria uma miniatura por foto.
        miniaturas.innerHTML = "";
        imagens.forEach((url, i) => {
            const mini = document.createElement("img");
            mini.src = url;
            mini.className = "galeria__miniatura";
            mini.alt = `Foto ${i + 1}`;
            mini.addEventListener("click", () => mostrar(i));
            miniaturas.appendChild(mini);
        });

        // Setas: passam para a foto anterior/próxima (dá a volta).
        const setaAnt = document.getElementById("setaAnterior");
        const setaProx = document.getElementById("setaProxima");
        if (imagens.length > 1) {
            setaAnt.style.display = "";
            setaProx.style.display = "";
            setaAnt.addEventListener("click", () => mostrar((atual - 1 + imagens.length) % imagens.length));
            setaProx.addEventListener("click", () => mostrar((atual + 1) % imagens.length));
        } else {
            esconderSetas();
        }

        mostrar(0);
    }

    function esconderSetas() {
        const setaAnt = document.getElementById("setaAnterior");
        const setaProx = document.getElementById("setaProxima");
        if (setaAnt) setaAnt.style.display = "none";
        if (setaProx) setaProx.style.display = "none";
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
