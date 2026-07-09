(function () {
    var CHAVE_TEMA = "vl-tema";

    function temaAtual() {
        var salvo = localStorage.getItem(CHAVE_TEMA);
        if (salvo === "dark" || salvo === "light") {
            return salvo;
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    document.documentElement.setAttribute("data-theme", temaAtual());

    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll("[data-alternar-tema]").forEach(function (botao) {
            botao.addEventListener("click", function () {
                var novoTema = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
                document.documentElement.setAttribute("data-theme", novoTema);
                localStorage.setItem(CHAVE_TEMA, novoTema);
            });
        });
    });
})();
