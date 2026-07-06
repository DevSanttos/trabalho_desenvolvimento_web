const API_LOJAS = "http://localhost:8080/api/lojas";
const API_BACKEND = "http://localhost:8080";

(function () {
    const btnSalvar = document.getElementById("btnSalvarLoja");
    if (!btnSalvar) return;

    const lojista = JSON.parse(localStorage.getItem("lojista") || "null");
    if (!lojista || !lojista.loja) return; // dashboard.js redireciona

    // Campos de texto do formulário (id no HTML == nome do campo no backend).
    const campos = [
        "nome", "categoria",
        "cidade", "endereco",
        "whatsapp",
        "horaSemanaAbertura", "horaSemanaFechamento",
        "horaSabadoAbertura", "horaSabadoFechamento",
    ];

    // O logo é uma imagem (upload), guardada como URL.
    let logoUrl = "";
    const inputLogo = document.getElementById("logoArquivo");

    carregar();

    btnSalvar.addEventListener("click", salvar);

    // Ao escolher um arquivo de logo, envia e mostra a prévia.
    inputLogo.addEventListener("change", async () => {
        if (inputLogo.files.length === 0) return;
        try {
            logoUrl = await enviarImagem(inputLogo.files[0]);
            renderLogoPreview();
        } catch (err) {
            mostrar("Não foi possível enviar o logo.");
        }
        inputLogo.value = "";
    });

    async function carregar() {
        try {
            const resp = await fetch(`${API_LOJAS}/${lojista.loja.slug}`);
            if (!resp.ok) return;
            const loja = await resp.json();
            campos.forEach((c) => {
                const el = document.getElementById(c);
                if (el) el.value = loja[c] || "";
            });
            logoUrl = loja.logoUrl || "";
            renderLogoPreview();
        } catch (err) {
            mostrar("Não foi possível carregar os dados da loja.");
        }
    }

    async function salvar() {
        const payload = {};
        campos.forEach((c) => {
            const el = document.getElementById(c);
            payload[c] = el ? el.value.trim() : null;
        });
        payload.logoUrl = logoUrl; // o logo vem do upload, não de um input de texto

        if (!payload.nome) {
            mostrar("O nome da loja é obrigatório.");
            return;
        }

        try {
            const resp = await fetch(`${API_LOJAS}/${lojista.loja.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (resp.ok) {
                const atualizada = await resp.json();
                lojista.loja.nome = atualizada.nome;
                localStorage.setItem("lojista", JSON.stringify(lojista));
                mostrar("Alterações salvas com sucesso!", false);
            } else {
                const dados = await resp.json().catch(() => ({}));
                mostrar(dados.erro || Object.values(dados).join(" ") || "Não foi possível salvar.");
            }
        } catch (err) {
            mostrar("Erro de conexão com o servidor.");
        }
    }

    // Mostra a prévia do logo (com um botão para remover).
    function renderLogoPreview() {
        const cont = document.getElementById("logoPreview");
        cont.innerHTML = "";
        if (!logoUrl) return;
        const item = document.createElement("div");
        item.className = "preview-item";
        item.innerHTML = `
            <img src="${logoUrl}" alt="Logo da loja">
            <button type="button" class="preview-remover" title="Remover">&times;</button>`;
        item.querySelector(".preview-remover").addEventListener("click", () => {
            logoUrl = "";
            renderLogoPreview();
        });
        cont.appendChild(item);
    }

    // Envia o arquivo para o backend e devolve a URL completa da imagem salva.
    async function enviarImagem(arquivo) {
        const dados = new FormData();
        dados.append("arquivo", arquivo);
        const resp = await fetch(`${API_BACKEND}/api/upload`, { method: "POST", body: dados });
        if (!resp.ok) throw new Error("upload falhou");
        const json = await resp.json();
        return API_BACKEND + json.url;
    }

    function mostrar(texto, ehErro = true) {
        const el = document.getElementById("lojaMensagem");
        if (!el) return;
        el.textContent = texto;
        el.classList.toggle("mensagem-erro", ehErro);
        el.classList.toggle("mensagem-sucesso", !ehErro);
    }
})();
