const API_BASE_PUBLICO = "http://localhost:8080/api/lojas";

const moedaBRPub = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const SEM_IMAGEM = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

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

        try {
            const resp = await fetch(`${API_BASE_PUBLICO}/${slug}/produtos`);
            produtos = resp.ok ? await resp.json() : [];
        } catch (err) {
            produtos = [];
        }
        montarAbas();
        render();
    }

    function montarAbas() {
        const nav = document.getElementById("lojaAbas");
        if (!nav) return;

        const categorias = [];
        for (let i = 0; i < produtos.length; i++) {
            const c = produtos[i].categoria;
            if (c && !categorias.includes(c)) {
                categorias.push(c);
            }
        }

        let html = `<button class="loja-abas__item ativo" data-categoria="todos">Todos</button>`;
        for (let i = 0; i < categorias.length; i++) {
            html += `<button class="loja-abas__item" data-categoria="${esc(categorias[i])}">${esc(categorias[i])}</button>`;
        }
        nav.innerHTML = html;

        const botoes = nav.querySelectorAll(".loja-abas__item");
        for (let i = 0; i < botoes.length; i++) {
            botoes[i].addEventListener("click", () => {
                for (let j = 0; j < botoes.length; j++) {
                    botoes[j].classList.remove("ativo");
                }
                botoes[i].classList.add("ativo");
                categoriaAtual = botoes[i].dataset.categoria;
                render();
            });
        }
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
        if (logoEl) {
            logoEl.onerror = () => { logoEl.onerror = null; logoEl.src = SEM_IMAGEM; };
            logoEl.src = loja.logoUrl || SEM_IMAGEM;
        }

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
        const img = p.imagemUrl ? esc(p.imagemUrl) : SEM_IMAGEM;
        const categoria = p.categoria || "";
        return `
            <a href="produto.html?id=${esc(p.id)}" class="cartao-produto">
                <div class="cartao-produto__imagem-wrapper">
                    <img src="${img}" alt="${esc(p.nome)}" class="cartao-produto__imagem"
                         onerror="this.onerror=null;this.src='${SEM_IMAGEM}'">
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
