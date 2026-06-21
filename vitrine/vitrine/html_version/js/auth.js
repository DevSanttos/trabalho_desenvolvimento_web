// Integração das telas de Login e Cadastro com o backend Spring Boot.
// O backend roda em localhost:8080 e o frontend em outra origem (Live Server),
// por isso usamos a URL absoluta e o backend tem CORS habilitado.

const API_BASE = "http://localhost:8080/api/lojistas";

// Exibe uma mensagem de feedback (erro ou sucesso) no elemento indicado.
function mostrarMensagem(elId, texto, ehErro = true) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.textContent = texto;
    el.classList.toggle("mensagem-erro", ehErro);
    el.classList.toggle("mensagem-sucesso", !ehErro);
}

// Lê o corpo de erro retornado pelo backend e devolve um texto legível.
// 409 -> { "erro": "..." }  |  400 (validação) -> { "campo": "mensagem", ... }
async function extrairMensagemErro(response, fallback) {
    try {
        const dados = await response.json();
        if (dados.erro) return dados.erro;
        const mensagens = Object.values(dados);
        if (mensagens.length > 0) return mensagens.join(" ");
    } catch (e) {
        // resposta sem corpo JSON
    }
    return fallback;
}

// ===== CADASTRO =====
const cadastroForm = document.getElementById("cadastroForm");
if (cadastroForm) {
    cadastroForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nomeLoja = document.getElementById("nomeLoja").value.trim();
        const email = document.getElementById("cadastroEmail").value.trim();
        const senha = document.getElementById("cadastroSenha").value;
        const confirmaSenha = document.getElementById("confirmaSenha").value;
        const termos = document.getElementById("termos").checked;

        // Validações de cliente antes de chamar a API.
        if (senha !== confirmaSenha) {
            mostrarMensagem("cadastroMensagem", "As senhas não coincidem.");
            return;
        }
        if (senha.length < 6) {
            mostrarMensagem("cadastroMensagem", "A senha deve ter ao menos 6 caracteres.");
            return;
        }
        if (!termos) {
            mostrarMensagem("cadastroMensagem", "Você precisa aceitar os termos de uso.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/cadastro`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nomeLoja, email, senha }),
            });

            if (response.ok) {
                const lojista = await response.json();
                localStorage.setItem("lojista", JSON.stringify(lojista));
                window.location.href = "dashboard/index.html";
            } else {
                const msg = await extrairMensagemErro(response, "Não foi possível concluir o cadastro.");
                mostrarMensagem("cadastroMensagem", msg);
            }
        } catch (err) {
            mostrarMensagem("cadastroMensagem", "Erro de conexão com o servidor. O backend está rodando?");
        }
    });
}

// ===== LOGIN =====
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const senha = document.getElementById("loginSenha").value;

        try {
            const response = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha }),
            });

            if (response.ok) {
                const lojista = await response.json();
                localStorage.setItem("lojista", JSON.stringify(lojista));
                window.location.href = "dashboard/index.html";
            } else {
                const msg = await extrairMensagemErro(response, "Email ou senha inválidos.");
                mostrarMensagem("loginMensagem", msg);
            }
        } catch (err) {
            mostrarMensagem("loginMensagem", "Erro de conexão com o servidor. O backend está rodando?");
        }
    });
}
