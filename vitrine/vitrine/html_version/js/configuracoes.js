// Configurações: editar dados da conta (nome/email/telefone) e trocar a senha.

const API_LOJISTAS_CONF = "http://localhost:8080/api/lojistas";
const API_LOJAS_CONF = "http://localhost:8080/api/lojas";

(function () {
    const lojista = JSON.parse(localStorage.getItem("lojista") || "null");
    if (!lojista || !lojista.loja) return; // dashboard.js redireciona

    preencher();

    document.getElementById("btnSalvarConta").addEventListener("click", salvarConta);
    document.getElementById("btnAlterarSenha").addEventListener("click", alterarSenha);

    async function preencher() {
        document.getElementById("confNome").value = lojista.loja.nome || "";
        document.getElementById("confEmail").value = lojista.email || "";
        // Telefone (whatsapp) vem do detalhe da loja.
        try {
            const resp = await fetch(`${API_LOJAS_CONF}/${lojista.loja.slug}`);
            if (resp.ok) {
                const loja = await resp.json();
                document.getElementById("confTelefone").value = loja.whatsapp || "";
            }
        } catch (err) {
            /* silencioso */
        }
    }

    async function salvarConta() {
        const payload = {
            nomeLoja: document.getElementById("confNome").value.trim(),
            email: document.getElementById("confEmail").value.trim(),
            telefone: document.getElementById("confTelefone").value.trim(),
        };
        if (!payload.nomeLoja || !payload.email) {
            mostrar("contaMensagem", "Nome e email são obrigatórios.");
            return;
        }
        try {
            const resp = await fetch(`${API_LOJISTAS_CONF}/${lojista.id}/conta`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (resp.ok) {
                const atualizado = await resp.json();
                lojista.email = atualizado.email;
                lojista.loja.nome = atualizado.loja.nome;
                localStorage.setItem("lojista", JSON.stringify(lojista));
                mostrar("contaMensagem", "Informações salvas com sucesso!", false);
            } else {
                const d = await resp.json().catch(() => ({}));
                mostrar("contaMensagem", d.erro || Object.values(d).join(" ") || "Não foi possível salvar.");
            }
        } catch (err) {
            mostrar("contaMensagem", "Erro de conexão com o servidor.");
        }
    }

    async function alterarSenha() {
        const senhaAtual = document.getElementById("senhaAtual").value;
        const novaSenha = document.getElementById("novaSenha").value;
        const confirmar = document.getElementById("confirmarSenha").value;

        if (!senhaAtual || !novaSenha) {
            mostrar("senhaMensagem", "Preencha a senha atual e a nova senha.");
            return;
        }
        if (novaSenha.length < 8) {
            mostrar("senhaMensagem", "A nova senha deve ter ao menos 8 caracteres.");
            return;
        }
        if (novaSenha !== confirmar) {
            mostrar("senhaMensagem", "A confirmação não bate com a nova senha.");
            return;
        }
        try {
            const resp = await fetch(`${API_LOJISTAS_CONF}/${lojista.id}/senha`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ senhaAtual, novaSenha }),
            });
            if (resp.ok) {
                document.getElementById("senhaAtual").value = "";
                document.getElementById("novaSenha").value = "";
                document.getElementById("confirmarSenha").value = "";
                mostrar("senhaMensagem", "Senha alterada com sucesso!", false);
            } else {
                const d = await resp.json().catch(() => ({}));
                mostrar("senhaMensagem", d.erro || Object.values(d).join(" ") || "Não foi possível alterar a senha.");
            }
        } catch (err) {
            mostrar("senhaMensagem", "Erro de conexão com o servidor.");
        }
    }

    function mostrar(elId, texto, ehErro = true) {
        const el = document.getElementById(elId);
        if (!el) return;
        el.textContent = texto;
        el.classList.toggle("mensagem-erro", ehErro);
        el.classList.toggle("mensagem-sucesso", !ehErro);
    }
})();
