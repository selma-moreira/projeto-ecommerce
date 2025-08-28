function adicionarProdutoAoCarrinho(elementoProduto) {
    const produtoId = elementoProduto.dataset.id;
    const produtoNome = elementoProduto.querySelector(".nome").textContent;
    const produtoImagem = elementoProduto.querySelector("img").getAttribute("src");
    const produtoPreco = parseFloat(elementoProduto.querySelector(".preco").textContent.replace("R$ ", "").replace(".", "").replace(",", "."));

    const carrinho = obterProdutosDoCarrinho();
    const existeProduto = carrinho.find(produto => produto.id === produtoId);
    if (existeProduto) {
        existeProduto.quantidade += 1;
    } else {
        carrinho.push({
            id: produtoId,
            nome: produtoNome,
            imagem: produtoImagem,
            preco: produtoPreco,
            quantidade: 1
        });
    }
    salvarProdutosNoCarrinho(carrinho);
    atualizarCarrinhoETabela();
}

// Refatoração: uso de delegação de eventos para melhor performance
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('adicionar-ao-carrinho')) {
        const elementoProduto = event.target.closest('.produto');
        if (elementoProduto) {
            adicionarProdutoAoCarrinho(elementoProduto);
        }
    }
});
function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem("carrinho");
    return produtos ? JSON.parse(produtos) : [];
}

function atualizarContadorCarrinho() {
    const produtos = obterProdutosDoCarrinho()
    let total = 0;

    produtos.forEach(produto => {
        total += produto.quantidade;
    });

    document.getElementById("contador-carrinho").textContent = total;
}

function renderizarTabelaDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector("#modal-1-content tbody");
    corpoTabela.innerHTML = "";

    produtos.forEach(produto => {
        const tr = document.createElement("tr");
        // Refatoração: corrigido atributo data-id e value do input
        tr.innerHTML = `<td class="td-produto"><img src="${produto.imagem}" alt="${produto.nome}" /></td>
            <td>${produto.nome}</td>
            <td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
            <td class="td-quantidade">
                <input type="number" class="input-quantidade" data-id="${produto.id}" value="${produto.quantidade}" min="1">
            </td>
            <td class="td-preco-total">R$ ${(produto.preco * produto.quantidade).toFixed(2).replace(".", ",")}</td>
            <td><button class="btn-remover" data-id="${produto.id}" id="deletar"></button></td>`;
        corpoTabela.appendChild(tr);
    });
}

// Refatoração: delegação de eventos para tbody, evitando múltiplos listeners
const corpoTabela = document.querySelector("#modal-1-content tbody");
corpoTabela.addEventListener("click", evento => {
    if (evento.target.classList.contains("btn-remover")) {
        const id = evento.target.dataset.id;
        removerProdutoDoCarrinho(id);
    }
});

corpoTabela.addEventListener("input", evento => {
    if (evento.target.classList.contains("input-quantidade")) {
        const produtos = obterProdutosDoCarrinho();
        const produto = produtos.find(produto => produto.id === evento.target.dataset.id);
        let novaQuantidade = parseInt(evento.target.value);
        if (produto && novaQuantidade > 0) {
            produto.quantidade = novaQuantidade;
            salvarProdutosNoCarrinho(produtos);
            atualizarCarrinhoETabela();
        }
    }
});

function removerProdutoDoCarrinho(id) {
    const produtos = obterProdutosDoCarrinho();
    const carrinhoAtualizado = produtos.filter(produto => produto.id !== id);

    salvarProdutosNoCarrinho(carrinhoAtualizado);
    atualizarCarrinhoETabela();
}

function atualizarValorTotalCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    let total = 0;

    produtos.forEach(produto => {
        total += produto.preco * produto.quantidade;
    });

    document.querySelector("#total-carrinho").textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
}

function atualizarCarrinhoETabela() {
    atualizarContadorCarrinho();
    renderizarTabelaDoCarrinho();
    atualizarValorTotalCarrinho();
}

atualizarCarrinhoETabela();
