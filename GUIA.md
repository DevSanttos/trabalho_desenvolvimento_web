# Guia de Defesa — VitrineLocal

Este guia explica o projeto em português simples, para você conseguir apresentar e
responder perguntas. Está dividido em: visão geral, backend (camada por camada),
frontend, conceitos-chave e perguntas prováveis com respostas curtas.

---

## 1. Visão geral

**O que é:** uma vitrine local. Lojistas se cadastram, criam sua loja e seus produtos.
O público navega: **home → cidade → loja → produto**.

**Tecnologias:**
- **Backend:** Java + Spring Boot (padrão MVC), banco PostgreSQL.
- **Frontend:** HTML + CSS + JavaScript puro (sem framework), que conversa com o backend
  por requisições HTTP (`fetch`).

**Como as duas partes se falam:** o frontend faz chamadas para `http://localhost:8080/api/...`
e recebe/envia dados em **JSON**.

---

## 2. Backend — a arquitetura em camadas (MVC)

Toda requisição passa por esta sequência. Cada camada tem **uma** responsabilidade:

```
Navegador (fetch)
   → Controller   (recebe a requisição HTTP)
   → Service      (regras de negócio)
   → Repository   (acesso ao banco de dados)
   → Banco (PostgreSQL)
```

Por que separar? Para o código ficar organizado: o Controller não sabe SQL, o Repository
não sabe regra de negócio. Se algo muda, você mexe só numa camada.

### 2.1 `model/` — as entidades (tabelas do banco)
Classes anotadas com `@Entity` viram tabelas. Temos três:
- **`Lojista`** — a conta: `id`, `email`, `senha` (hash). Tem uma loja (`@OneToOne`).
- **`Loja`** — a loja: `id`, `nome`, `slug` (nome para URL) e dados (cidade, endereço,
  whatsapp, horário...). 
- **`Produto`** — `id`, `nome`, `preco`, `categoria`, `imagemUrl`, `ativo`... Pertence a
  uma loja (`@ManyToOne` — muitos produtos para uma loja).

### 2.2 `repository/` — acesso ao banco
Interfaces que herdam de `JpaRepository`. O Spring **gera o SQL sozinho** a partir do nome
do método. Ex: `findByEmail(...)` vira "SELECT ... WHERE email = ?". Ganhamos `save`,
`findById`, `delete` etc. de graça.

### 2.3 `DTO/` — os "pacotes" de dados que entram e saem
DTO = *Data Transfer Object*. Usamos `record` (uma classe curta só de dados). Servem para
**não expor a entidade direto na API**. O mais importante: o `LojistaResponseDTO`/
`ProdutoResponseDTO` **nunca devolvem a senha**. Há DTOs de entrada (com validações
`@NotBlank`, `@Email`) e de saída.

### 2.4 `service/` — as regras de negócio (o "cérebro")
- `LojistaService` — cadastro (gera o hash da senha), login (confere a senha), trocar
  senha, atualizar conta.
- `ProdutoService` — criar/listar/editar/excluir produtos.
- `LojaService` — buscar e atualizar a loja.
- `CidadeService` — monta a lista de cidades a partir das lojas.

### 2.5 `controller/` — as "portas de entrada" (endpoints)
Definem as URLs da API. Só recebem a requisição, chamam o service e devolvem a resposta.
- `LojistaController` → `/api/lojistas` (cadastro, login, conta, senha)
- `ProdutoController` → `/api/produtos` (CRUD)
- `LojaController` → `/api/lojas` (dados da loja + produtos públicos)
- `CidadeController` → `/api/cidades`

### 2.6 `config/SecurityConfig`
Duas coisas: cria o **BCrypt** (para o hash da senha) e configura **CORS** (permite o
frontend, que roda em outra porta, chamar a API). Também libera as rotas (a autenticação é
feita "na mão" no service — login simples).

### 2.7 `exception/` — tratamento de erros
`GlobalExceptionHandler` (`@RestControllerAdvice`) transforma erros em respostas claras:
email repetido → **409**, senha errada → **401**, não encontrado → **404**, validação → **400**.

### 2.8 `util/SlugUtil`
Função auxiliar que transforma "Casa & Design" em "casa-design" (texto bom para URL).

---

## 3. Frontend — os arquivos JavaScript

Cada página HTML carrega o(s) `.js` que precisa. Os `.js` usam `fetch` para falar com a API.

- **`auth.js`** — login e cadastro. No sucesso, guarda o lojista no `localStorage`.
- **`dashboard.js`** — protege o painel: se não há login no `localStorage`, manda pro login.
  Também mostra o nome da loja.
- **`loja-form.js`** — "Minha loja": carrega e salva os dados da loja.
- **`produtos.js`** — lista de produtos do painel (com busca, filtros e ações).
- **`produto-form.js`** — formulário de criar/editar produto.
- **`dashboard-home.js`** — estatísticas da tela inicial do painel.
- **`configuracoes.js`** — editar conta e trocar senha.
- **`home.js`** — lista as cidades na home.
- **`cidade.js`** — lista as lojas de uma cidade.
- **`loja-publica.js`** — vitrine pública: cabeçalho + produtos da loja.
- **`produto.js`** — página de detalhe de um produto.

---

## 4. Conceitos-chave (provavelmente vão perguntar)

**Hash da senha (BCrypt):** a senha nunca é salva em texto puro. O BCrypt transforma ela
num código irreversível, com um "sal" aleatório embutido. No login, comparamos a senha
digitada com o hash (`matches`), sem "descriptografar".

**DTO:** objeto separado para a API, para não expor a entidade do banco (e nunca devolver a
senha).

**`@Transactional`:** garante que as operações no banco funcionem como "tudo ou nada" — se
der erro no meio, desfaz. `readOnly = true` é uma dica de "só leitura" (otimização).

**`@OneToOne` / `@ManyToOne`:** relações entre tabelas. Um lojista tem **uma** loja; uma
loja tem **muitos** produtos (chave estrangeira `loja_id` na tabela `produto`).

**slug:** versão do nome amigável para URL (`casa-design`). Usamos na vitrine pública
(`loja.html?loja=casa-design`) porque é mais bonito e estável que mostrar o id.

**CORS:** como o frontend (porta 5500) e o backend (porta 8080) são "origens" diferentes, o
navegador bloqueia por padrão. O CORS no backend libera as chamadas do frontend.

**`localStorage`:** memória do navegador. Guardamos ali os dados do lojista logado para
mostrar o nome no painel e proteger as páginas.

**`POST` x `GET`:** `GET` lê dados (vão na URL); `POST` envia dados (vão no corpo). Login é
`POST` para a senha não aparecer na URL.

---

## 5. Perguntas prováveis e respostas curtas

- **"Por que login é POST e não GET?"** Para a senha ir no corpo da requisição, não na URL
  (que fica no histórico e nos logs).
- **"Onde a senha é protegida?"** No `LojistaService`: `passwordEncoder.encode()` no
  cadastro e `passwordEncoder.matches()` no login. Guardamos só o hash BCrypt.
- **"Por que tem DTO se já tem a entidade?"** Para não expor a senha e não acoplar a API à
  estrutura do banco.
- **"Como o frontend sabe quem está logado?"** Pelo `localStorage`, preenchido no login.
- **"O dashboard é seguro?"** Tem uma proteção no cliente (`dashboard.js`). É suficiente para
  o trabalho; uma proteção real usaria token (JWT) no servidor.
- **"Por que `(function(){ ... })()` nos arquivos JS?"** É uma função que roda sozinha; serve
  para as variáveis de um arquivo **não conflitarem** com as de outro arquivo carregado na
  mesma página.
- **"Por que escapar o HTML no JS (`esc`)?"** Segurança: evita que um texto com `<script>`
  vindo do banco seja executado na página (ataque XSS).

---

> Dica de apresentação: mostre o **fluxo de uma ação real** de ponta a ponta (ex: "criar um
> produto") passando por Controller → Service → Repository → banco, e depois mostre o
> produto aparecendo na vitrine. Isso demonstra que você entende a arquitetura inteira.
