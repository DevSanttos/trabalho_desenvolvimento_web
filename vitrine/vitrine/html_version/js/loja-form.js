// "Minha loja": carrega os dados da loja logada e salva as alterações (PUT).

const API_LOJAS = "http://localhost:8080/api/lojas";

(function () {
    const btnSalvar = document.getElementById("btnSalvarLoja");
    if (!btnSalvar) return;

    const lojista = JSON.parse(localStorage.getItem("lojista") || "null");
    if (!lojista || !lojista.loja) return; // dashboard.js redireciona

    // Campos do formulário (id no HTML == nome do campo no backend).
    const campos = [
        "nome", "categoria", "descricao", "logoUrl",
        "cidade", "endereco", "cep",
        "whatsapp", "emailContato", "instagram",
        "horaSemanaAbertura", "horaSemanaFechamento",
        "horaSabadoAbertura", "horaSabadoFechamento",
    ];

    carregar();

    btnSalvar.addEventListener("click", salvar);

    async function carregar() {
        try {
            const resp = await fetch(`${API_LOJAS}/${lojista.loja.slug}`);
            if (!resp.ok) return;
            const loja = await resp.json();
            campos.forEach((c) => {
                const el = document.getElementById(c);
                if (el) el.value = loja[c] || "";
            });
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
                // Mantém o localStorage em dia (o nome pode ter mudado).
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

    function mostrar(texto, ehErro = true) {
        const el = document.getElementById("lojaMensagem");
        if (!el) return;
        el.textContent = texto;
        el.classList.toggle("mensagem-erro", ehErro);
        el.classList.toggle("mensagem-sucesso", !ehErro);
    }
})();
