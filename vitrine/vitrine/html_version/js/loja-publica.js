// Vitrine pública: identifica a loja pelo slug na URL (?loja=casa-design),
// carrega o cabeçalho e os produtos ativos, e filtra por categoria nas abas.

const API_BASE_PUBLICO = "http://localhost:8080/api/lojas";

const CATEGORIA_LABEL_PUB = {
    sofas: "Sofás",
    mesas: "Mesas",
    cadeiras: "Cadeiras",
    decoracao: "Decoração",
};

const moedaBRPub = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

(function () {
    const grade = document.getElementById("produtosGrade");
    if (!grade) return;

    const slug = new URLSearchParams(window.location.search).get("loja");
    if (!slug) {
        document.getElementById("lojaNome").textContent = "Loja não informada";
        grade.innerHTML = mensagem("Abra a vitrine a partir de uma loja (URL sem ?loja=).");
        return;
    }

    let produtos = [];
    let categoriaAtual = "todos";

    carregar();

    document.querySelectorAll(".loja-abas__item").forEach((botao) => {
        botao.addEventListener("click", () => {
            document.querySelectorAll(".loja-abas__item").forEach((b) => b.classList.remove("ativo"));
            botao.classList.add("ativo");
            categoriaAtual = botao.dataset.categoria;
            render();
        });
    });

    async function carregar() {
        // Cabeçalho da loja
        try {
            const respLoja = await fetch(`${API_BASE_PUBLICO}/${slug}`);
            if (respLoja.ok) {
                preencherCabecalho(await respLoja.json());
            } else {
                document.getElementById("lojaNome").textContent = "Loja não encontrada";
                grade.innerHTML = mensagem("Essa loja não existe ou o endereço está incorreto.");
                return;
            }
        } catch (err) {
            document.getElementById("lojaNome").textContent = "Erro de conexão";
            grade.innerHTML = mensagem("Não foi possível conectar ao servidor.");
            return;
        }

        // Produtos ativos
        try {
            const resp = await fetch(`${API_BASE_PUBLICO}/${slug}/produtos`);
            produtos = resp.ok ? await resp.json() : [];
        } catch (err) {
            produtos = [];
        }
        render();
    }

    function preencherCabecalho(loja) {
        document.getElementById("lojaNome").textContent = loja.nome;

        const catEl = document.getElementById("lojaCategoria");
        if (catEl) catEl.textContent = loja.categoria || "";

        const endEl = document.getElementById("lojaEndereco");
        if (endEl) {
            const partes = [loja.endereco, loja.cidade].filter(Boolean);
            endEl.textContent = partes.length ? partes.join(" - ") : "Endereço não informado";
        }

        const horaEl = document.getElementById("lojaHorario");
        if (horaEl) horaEl.textContent = montarHorario(loja);

        const logoEl = document.getElementById("lojaLogo");
        if (logoEl && loja.logoUrl) logoEl.src = loja.logoUrl;

        const whats = document.getElementById("btnWhatsapp");
        if (whats) {
            const numero = (loja.whatsapp || "").replace(/\D/g, "");
            if (numero) {
                whats.addEventListener("click", () => {
                    window.open(`https://wa.me/55${numero}`, "_blank");
                });
            } else {
                whats.style.display = "none";
            }
        }
    }

    function montarHorario(loja) {
        const partes = [];
        if (loja.horaSemanaAbertura && loja.horaSemanaFechamento) {
            partes.push(`Seg-Sex: ${loja.horaSemanaAbertura}-${loja.horaSemanaFechamento}`);
        }
        if (loja.horaSabadoAbertura && loja.horaSabadoFechamento) {
            partes.push(`Sáb: ${loja.horaSabadoAbertura}-${loja.horaSabadoFechamento}`);
        }
        return partes.length ? partes.join(" | ") : "Horário não informado";
    }

    function render() {
        let lista = produtos;
        if (categoriaAtual !== "todos") {
            lista = lista.filter((p) => p.categoria === categoriaAtual);
        }

        if (lista.length === 0) {
            grade.innerHTML = mensagem("Nenhum produto nesta categoria.");
            return;
        }

        grade.innerHTML = lista.map((p) => card(p)).join("");
        if (window.lucide) lucide.createIcons();
    }

    function card(p) {
        const img = p.imagemUrl ? esc(p.imagemUrl) : "imagens/sofa-loja.webp";
        const categoria = CATEGORIA_LABEL_PUB[p.categoria] || p.categoria;
        return `
            <a href="produto.html?id=${esc(p.id)}" class="cartao-produto">
                <div class="cartao-produto__imagem-wrapper">
                    <img src="${img}" alt="${esc(p.nome)}" class="cartao-produto__imagem">
                </div>
                <div class="cartao-produto__corpo">
                    <div class="cartao-produto__titulo">${esc(p.nome)}</div>
                    <div class="cartao-produto__descricao">${esc(p.descricaoCurta)}</div>
                    <div class="cartao-produto__preco">${moedaBRPub.format(p.preco)}</div>
                    <div class="cartao-produto__rodape">
                        <span class="cartao-produto__tag">${esc(categoria)}</span>
                    </div>
                </div>
            </a>`;
    }

    function mensagem(texto) {
        return `<p style="padding:24px;color:var(--vl-secundario)">${texto}</p>`;
    }

    function esc(texto) {
        return String(texto)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }
})();
