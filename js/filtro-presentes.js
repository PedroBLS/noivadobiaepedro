document.addEventListener("DOMContentLoaded", function () {
    const botoesMenu = document.querySelectorAll(".item-menu");
    const todosOsCartoes = Array.from(document.querySelectorAll(".card-presente"));
    const containerGrid = document.getElementById("lista-presentes");
    const inputBusca = document.getElementById("input-busca");
    
    const ITENS_POR_PAGINA = 18;
    let paginaAtual = 1;
    let cartoesFiltrados = [...todosOsCartoes];

    // Cria a estrutura para os botões de paginação
    let containerPaginacao = document.getElementById("paginacao");
    if (!containerPaginacao) {
        containerPaginacao = document.createElement("div"); // Removida a linha duplicada
        containerPaginacao.id = "paginacao";
        containerGrid.after(containerPaginacao);
    }

    // Função que renderiza apenas os itens da página atual
    function renderizarPagina() {
        // 1. Esconde absolutamente todos os cartões primeiro
        todosOsCartoes.forEach(cartao => cartao.classList.add("escondido"));

        // 2. Calcula quais índices pertencem à página atual
        const indiceInicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
        const indiceFim = indiceInicio + ITENS_POR_PAGINA;

        // 3. Mostra apenas os cartões permitidos do grupo filtrado
        const cartoesExibidos = cartoesFiltrados.slice(indiceInicio, indiceFim);
        cartoesExibidos.forEach(cartao => cartao.classList.remove("escondido"));

        // 4. Atualiza os botões de numeração na tela
        configurarBotoesPaginacao();
    }

    // Função que desenha os botões de páginas (1, 2, 3...) lá embaixo
    function configurarBotoesPaginacao() {
        containerPaginacao.innerHTML = "";
        const totalPaginas = Math.ceil(cartoesFiltrados.length / ITENS_POR_PAGINA);

        // Se só tiver uma página ou nenhuma, não precisa exibir os botões de paginação
        if (totalPaginas <= 1) return;

        for (let i = 1; i <= totalPaginas; i++) {
            const botao = document.createElement("button");
            botao.innerText = i;
            botao.classList.add("btn-pagina");
            if (i === paginaAtual) botao.classList.add("ativo-pagina");

            botao.addEventListener("click", () => {
                paginaAtual = i;
                renderizarPagina();
                // Rola suavemente a tela de volta para o topo da vitrine
                document.querySelector(".vitrine-presentes").scrollIntoView({ behavior: "smooth" });
            });

            containerPaginacao.appendChild(botao);
        }
    }

    // Nova Lógica de Pesquisa
    if (inputBusca) {
        inputBusca.addEventListener("input", function() {
            const termo = this.value.toLowerCase();
            
            // Remove os filtros de categoria visualmente
            botoesMenu.forEach(b => b.classList.remove("ativo"));
            const btnTodos = document.getElementById("btn-todos");
            if (btnTodos) btnTodos.classList.add("ativo");

            // Filtra pelo texto do <h3> dentro de cada cartão
            cartoesFiltrados = todosOsCartoes.filter(cartao => {
                const nomePresente = cartao.querySelector("h3").innerText.toLowerCase();
                return nomePresente.includes(termo);
            });

            paginaAtual = 1;
            renderizarPagina();
        });
    }

    // Lógica de cliques no Menu de Categorias
    botoesMenu.forEach(item => {
        item.addEventListener("click", function () {
            // Remove a classe ativa de todos os botões e adiciona no clicado
            botoesMenu.forEach(b => b.classList.remove("ativo"));
            this.classList.add("ativo");

            // Descobre qual categoria foi escolhida através do ID (ex: btn-sala -> sala)
            const categoriaEscolhida = this.id.replace("btn-", "");

            // Filtra o array de cartões com base na escolha
            if (categoriaEscolhida === "todos") {
                cartoesFiltrados = [...todosOsCartoes];
            } else {
                cartoesFiltrados = todosOsCartoes.filter(cartao => 
                    cartao.getAttribute("data-category") === categoriaEscolhida
                );
            }

            // Limpa o campo de busca se o usuário clicar em alguma categoria nova
            if (inputBusca) inputBusca.value = "";

            // Reseta para a primeira página ao mudar de categoria e renderiza
            paginaAtual = 1;
            renderizarPagina();
        });
    });

    /* ==========================================================================
       A MÁGICA DE INTEGRAÇÃO COM A TELA INICIAL (LÊ A URL)
       ========================================================================== */
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaDaUrl = urlParams.get('categoria'); // Pega a palavra depois do "?categoria="

    if (categoriaDaUrl) {
        // Se a pessoa veio da tela inicial e tem um parâmetro na URL
        const botaoCategoria = document.getElementById("btn-" + categoriaDaUrl);
        if (botaoCategoria) {
            botaoCategoria.click(); // O JavaScript simula um clique no botão automaticamente!
        }
    } else {
        // Se a pessoa acessou a página de presentes normalmente, sem filtros
        renderizarPagina();
    }
});