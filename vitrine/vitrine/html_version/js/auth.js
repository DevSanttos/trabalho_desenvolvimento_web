const API_BASE = "http://localhost:8080/api/lojistas";

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function mostrarMensagem(elId, texto, ehErro = true) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.textContent = texto;
    el.classList.toggle("mensagem-erro", ehErro);
    el.classList.toggle("mensagem-sucesso", !ehErro);
}

async function extrairMensagemErro(response, fallback) {
    try {
        const dados = await response.json();
        if (dados.erro) return dados.erro;
        const mensagens = Object.values(dados);
        if (mensagens.length > 0) return mensagens.join(" ");
    } catch (e) {

    }
    return fallback;
}

// CADASTRO
const cadastroForm = document.getElementById("cadastroForm");
if (cadastroForm) {
    cadastroForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nomeLoja = document.getElementById("nomeLoja").value.trim();
        const email = document.getElementById("cadastroEmail").value.trim();
        const senha = document.getElementById("cadastroSenha").value;
        const confirmaSenha = document.getElementById("confirmaSenha").value;
        const termos = document.getElementById("termos").checked;

        // Validações
        if (!nomeLoja || !email || !senha || !confirmaSenha) {
            mostrarMensagem("cadastroMensagem", "Preencha todos os campos.");
            return;
        }
        if (!validarEmail(email)) {
            mostrarMensagem("cadastroMensagem", "Informe um email válido (com @).");
            return;
        }
        if (senha.length < 8) {
            mostrarMensagem("cadastroMensagem", "A senha deve ter ao menos 8 caracteres.");
            return;
        }
        if (senha !== confirmaSenha) {
            mostrarMensagem("cadastroMensagem", "As senhas não coincidem.");
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
                mostrarMensagem("cadastroMensagem", "Cadastro concluído! Faça o login para entrar.", false);
                cadastroForm.reset();
            } else {
                const msg = await extrairMensagemErro(response, "Não foi possível concluir o cadastro.");
                mostrarMensagem("cadastroMensagem", msg);
            }
        } catch (err) {
            mostrarMensagem("cadastroMensagem", "Erro de conexão com o servidor.");
        }
    });
}

// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    if (new URLSearchParams(window.location.search).get("cadastro") === "ok") {
        mostrarMensagem("loginMensagem", "Conta criada! Faça login para entrar.", false);
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const senha = document.getElementById("loginSenha").value;

        if (!email || !senha) {
            mostrarMensagem("loginMensagem", "Preencha email e senha.");
            return;
        }
        if (!validarEmail(email)) {
            mostrarMensagem("loginMensagem", "Informe um email válido (com @).");
            return;
        }

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
            mostrarMensagem("loginMensagem", "Erro de conexão com o servidor.");
        }
    });
}
