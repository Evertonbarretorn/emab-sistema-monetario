const produtosPadrao = [
    { nome: "Maçã", preco: 2, emoji: "🍎" },
    { nome: "Banana", preco: 1.5, emoji: "🍌" },
    { nome: "Biscoito", preco: 1.5, emoji: "🍪" },
    { nome: "Suco", preco: 3, emoji: "🧃" },
    { nome: "Água", preco: 2, emoji: "💧" },
    { nome: "Chocolate", preco: 2.5, emoji: "🍫" }
];

let carrinho = [];
localStorage.removeItem("carrinhoVenda");
let produtos = JSON.parse(localStorage.getItem("estoqueAluno")) || produtosPadrao;

let historicoVendas = JSON.parse(localStorage.getItem("historicoVendas")) || [];

let trocoSelecionado = 0;
let totalConfirmado = 0;
let valorConfirmado = false;

/* =========================
   HELPERS
========================= */

function salvar(){
    localStorage.setItem("carrinhoVenda", JSON.stringify(carrinho));
    localStorage.setItem("estoqueAluno", JSON.stringify(produtos));
}

function calcularTotal(){
    return carrinho.reduce((s,p)=>
        s + (p.quantidade||0) * (p.precoVenda||0),0
    );
}

function atualizarTotalUI(){
    const el = document.getElementById("totalPagar");
    if(!el) return;

    el.innerText = valorConfirmado
        ? "R$ " + totalConfirmado.toFixed(2).replace(".", ",")
        : "0,00";
}

function atualizarTrocoUI(){
    const el = document.getElementById("troco");
    if(el){
        el.innerText = "R$ " + trocoSelecionado.toFixed(2).replace(".", ",");
    }
}

/* =========================
   PRODUTOS
========================= */

function renderizarProdutos(){
    const grid = document.getElementById("gridProdutosContainer");
    if(!grid) return;

    grid.innerHTML = "";

    produtos.forEach(p => {
        const preco = parseFloat(p.precoVenda ?? p.preco ?? 0);

        grid.innerHTML += `
        <div class="product-card">
            <div class="emoji">${p.emoji}</div>
            <div class="nome">${p.nome}</div>
            <div class="preco">R$ ${preco.toFixed(2).replace(".", ",")}</div>
            <div class="estoque">Estoque: ${p.quantidade ?? 0}</div>

            <button onclick="adicionar('${p.nome}')"
                ${p.quantidade <= 0 ? "disabled" : ""}>
                Adicionar
            </button>
        </div>`;
    });
}

/* =========================
   ADICIONAR
========================= */

function adicionar(nome){

    const prod = produtos.find(p => p.nome === nome);
    if(!prod || prod.quantidade <= 0) return;

    let item = carrinho.find(p => p.nome === nome);

    if(item){
        item.quantidade++;
    } else {
        carrinho.push({
            nome: prod.nome,
            emoji: prod.emoji,
            precoVenda: prod.precoVenda ?? prod.preco,
            quantidade: 1
        });
    }

    prod.quantidade--;

    salvar();
    renderizarProdutos();
    renderizarCarrinho();
}

/* =========================
   CARRINHO
========================= */

function renderizarCarrinho(){

    const box = document.getElementById("cartContainer");
    if(!box) return;

    box.innerHTML = "";

    carrinho.forEach((p,i)=>{
        const subtotal = p.quantidade * p.precoVenda;

        box.innerHTML += `
        <div class="cart-item">
            <div>
                <strong>${p.nome}</strong><br>
                Qtd: ${p.quantidade}
            </div>

            <div>R$ ${subtotal.toFixed(2).replace(".", ",")}</div>

            <button onclick="removerItem(${i})">🗑</button>
        </div>`;
    });

    atualizarTotalUI();
}

/* =========================
   REMOVER
========================= */

function removerItem(i){

    const item = carrinho[i];
    const prod = produtos.find(p => p.nome === item.nome);

    if(prod){
        prod.quantidade += item.quantidade;
    }

    carrinho.splice(i,1);

    salvar();
    renderizarProdutos();
    renderizarCarrinho();
}

/* =========================
   VERIFICAR VALOR
========================= */

function verificarValor(){

    const total = calcularTotal();
    const valor = parseFloat(document.getElementById("valorDigitado").value || 0);

    const msg = document.getElementById("resultadoVerificacao");

    if(Math.abs(valor - total) < 0.01){
        valorConfirmado = true;
        totalConfirmado = total;

        msg.innerHTML = "✔ Valor correto!";
        msg.style.color = "green";

    } else {
        valorConfirmado = false;
        msg.innerHTML = "✖ Valor incorreto!";
        msg.style.color = "red";
    }

    atualizarTotalUI();
}

/* =========================
   FINALIZAR COMPRA
========================= */

function finalizarCompra(){

    totalConfirmado = calcularTotal();
    valorConfirmado = true;

    document.getElementById("resultadoVerificacao").innerHTML =
        "✔ Compra confirmada! Agora vá para o pagamento.";

    atualizarTotalUI();
}

/* =========================
   TROCO
========================= */

function adicionarTroco(valor){
    trocoSelecionado += valor;
    atualizarTrocoUI();
}

/* =========================
   VERIFICAR TROCO
========================= */

function verificarTroco(){

    const recebido = parseFloat(document.getElementById("valorRecebido").value || 0);
    const total = calcularTotal();

    const correto = recebido - total;

    const msg = document.getElementById("msgTroco");

    if(Math.abs(correto - trocoSelecionado) < 0.01){
        msg.innerHTML = "✔ Troco correto!";
        msg.style.color = "green";
    } else {
        msg.innerHTML = "✖ Troco incorreto!";
        msg.style.color = "red";
    }
}

/*=======LIMPAR TROCO======*/

function limparTroco(){

    trocoSelecionado = 0;

    atualizarTrocoUI();

    const msg = document.getElementById("msgTroco");

    if(msg){
        msg.innerHTML = "";
    }

}

/* =========================
   FINALIZAR VENDA
========================= */

function finalizarVenda(){

    const recebido = parseFloat(document.getElementById("valorRecebido").value || 0);

    const valorCompra = calcularTotal();

    if(carrinho.length === 0){
        alert("Carrinho vazio!");
        return;
    }

    const novaVenda = {
        alunoId: localStorage.getItem("alunoAtual"), // vincula ao aluno
        data: new Date().toLocaleString(),
        valorCompra: valorCompra,
        valorRecebido: recebido,
        troco: trocoSelecionado,
        itens: JSON.parse(JSON.stringify(carrinho))
    };

    historicoVendas.push(novaVenda);
    localStorage.setItem("historicoVendas", JSON.stringify(historicoVendas));

    // limpa tudo corretamente
    carrinho = [];
    trocoSelecionado = 0;
    totalConfirmado = 0;
    valorConfirmado = false;

    localStorage.removeItem("carrinhoVenda");

    salvar();

    renderizarCarrinho();
    renderizarProdutos();

    document.getElementById("valorDigitado").value = "";
    document.getElementById("valorRecebido").value = "";
    document.getElementById("resultadoVerificacao").innerHTML = "";
    document.getElementById("msgTroco").innerHTML = "";

    atualizarTrocoUI();
    atualizarTotalUI();

    alert("✔ Venda finalizada com sucesso!");
}

/* INIT */
renderizarProdutos();
renderizarCarrinho();