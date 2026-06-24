/* =========================
   PRODUTOS / CARRINHO
========================= */

const produtosPadrao = [
    { nome: "Maçã", preco: 2, emoji: "🍎" },
    { nome: "Banana", preco: 1.5, emoji: "🍌" },
    { nome: "Biscoito", preco: 1.5, emoji: "🍪" },
    { nome: "Suco", preco: 3, emoji: "🧃" },
    { nome: "Água", preco: 2, emoji: "💧" },
    { nome: "Chocolate", preco: 2.5, emoji: "🍫" }
];

/* =========================
   SALDO
========================= */

const SALDO_INICIAL = 500;

/* =========================
   CARREGAR CARRINHO
========================= */

// 🔥 AGORA USA O MESMO PADRÃO DA VENDA
let carrinho = JSON.parse(localStorage.getItem("carrinhoVenda"));

if (!carrinho || carrinho.length === 0) {

    const produtos = JSON.parse(localStorage.getItem("produtosDisponiveis")) || produtosPadrao;

    carrinho = produtos.map(p => ({
        nome: p.nome,
        emoji: p.emoji,
        preco: parseFloat(p.preco || 0),
        precoVenda: parseFloat(p.precoVenda || p.preco || 0),
        quantidade: p.quantidade || 0
    }));
}

/* =========================
   FORMATAR VALOR
========================= */

function formatar(valor){
    return Number(valor || 0).toFixed(2).replace(".", ",");
}

/* =========================
   RENDERIZAR CARRINHO
========================= */

function renderizarCarrinho() {

    const div = document.getElementById("listaCarrinho");
    if (!div) return;

    div.innerHTML = "";

    carrinho.forEach((p, i) => {

        const subtotal = (p.quantidade || 0) * (p.precoVenda || 0);

        div.innerHTML += `
        <div class="product-item">

            <div class="product-info">
                <div class="product-icon">${p.emoji}</div>

                <div class="product-detail">
                    <div class="name">${p.nome}</div>
                    <div class="price">Custo: R$ ${formatar(p.preco)}</div>

                    <div class="venda-box">
                        <span class="label">Preço de venda:</span>

                        <input
                            class="input-venda"
                            type="number"
                            step="0.01"
                            value="${p.precoVenda}"
                            onchange="alterarPreco(${i}, this.value)"
                        >
                    </div>
                </div>
            </div>

            <div class="quantity-controls">
                <button class="qty-btn" onclick="alterarQtd(${i},-1)">-</button>
                <span class="qty-value">${p.quantidade}</span>
                <button class="qty-btn" onclick="alterarQtd(${i},1)">+</button>
            </div>

            <div class="product-right">
                <div class="subtotal-box">
                    R$ ${formatar(subtotal)}
                </div>

                <button class="delete-btn" onclick="removerItem(${i})">🗑️</button>
            </div>

        </div>`;
    });

    atualizarTotais();

    // 🔥 SEMPRE sincroniza com a venda
    localStorage.setItem("carrinhoVenda", JSON.stringify(carrinho));
}

/* =========================
   ALTERAR QUANTIDADE
========================= */

function alterarQtd(i, v) {

    carrinho[i].quantidade = (carrinho[i].quantidade || 0) + v;

    if (carrinho[i].quantidade < 0) {
        carrinho[i].quantidade = 0;
    }

    renderizarCarrinho();
}

/* =========================
   ALTERAR PREÇO
========================= */

function alterarPreco(i, v) {
    carrinho[i].precoVenda = parseFloat(v) || 0;
    renderizarCarrinho();
}

/* =========================
   REMOVER ITEM
========================= */

function removerItem(i) {
    carrinho[i].quantidade = 0;
    renderizarCarrinho();
}

/* =========================
   TOTAIS
========================= */

function atualizarTotais() {

    let total = 0;

    carrinho.forEach(p => {
        total += (p.quantidade || 0) * (p.precoVenda || 0);
    });

    const totalEl = document.getElementById("totalGasto");
    const totalFinalEl = document.getElementById("totalGastoFinal");
    const saldoEl = document.getElementById("saldo");

    if (totalEl) totalEl.innerText = formatar(total);
    if (totalFinalEl) totalFinalEl.innerText = formatar(total);
    if (saldoEl) saldoEl.innerText = formatar(SALDO_INICIAL - total);
}

/* =========================
   SALVAR MENU
========================= */

function salvarMenu() {

    const estoqueAluno = carrinho
        .filter(p => p.quantidade > 0)
        .map(p => ({
            nome: p.nome,
            emoji: p.emoji,
            precoCompra: p.preco,
            precoVenda: p.precoVenda,
            quantidade: p.quantidade
        }));

    localStorage.setItem("estoqueAluno", JSON.stringify(estoqueAluno));

    // 🔥 LIMPA VENDA PARA COMEÇAR NOVA
    localStorage.setItem("carrinhoVenda", JSON.stringify(carrinho));

    window.location.href = "vendas.html";
}

/* =========================
   INICIAR
========================= */

renderizarCarrinho();