const alunos = JSON.parse(localStorage.getItem("alunos")) || [];

const alunoAtual = localStorage.getItem("alunoAtual");

const qrUrl = `${window.location.origin}/certificado.html?aluno=${alunoAtual}`;

const aluno = alunos.find(a => String(a.id) === String(alunoAtual)) || null;

const SALDO_INICIAL = 500;

const todasVendas = JSON.parse(localStorage.getItem("historicoVendas")) || [];

const vendas = todasVendas.filter(v =>
    v.alunoId && String(v.alunoId) === String(alunoAtual)
);

// ========================
// CÁLCULOS
// ========================
let totalVendido = 0;
let totalComprado = 0;

vendas.forEach(v => {
    totalVendido += Number(v.valorCompra || 0);

    v.itens.forEach(p => {
        totalComprado += Number(p.quantidade || 0) * Number(p.precoVenda || 0);
    });
});

const lucro = totalVendido - totalComprado;
const saldoFinal = SALDO_INICIAL + lucro;

// ========================
// HTML
// ========================
let html = "";

/* ================= HEADER ================= */
html += `
<div class="cupom">

    <div class="topo-escola">
        <img src="img/logo-escola.png" class="logo-escola">

        <div class="topo-texto">
            <h1>EMAB - SISTEMA MONETÁRIO</h1>
            <p>Educação Financeira na Prática</p>
        </div>
    </div>

    <div class="cupom-info">
        <p><strong>Aluno:</strong> ${aluno?.nome || ""}</p>
        <p><strong>Turma:</strong> ${aluno?.turma || ""}</p>
        <p><strong>Data:</strong> ${new Date().toLocaleDateString("pt-BR")}</p>
    </div>

    <h3 class="titulo-sec">📊 RESUMO FINANCEIRO</h3>

    <div class="resumo-box">
        <p>💰 Saldo inicial: <b>R$ ${SALDO_INICIAL.toFixed(2)}</b></p>
        <p>📦 Custos: <b>R$ ${totalComprado.toFixed(2)}</b></p>
        <p>💵 Faturamento: <b>R$ ${totalVendido.toFixed(2)}</b></p>
        <p>📈 Lucro: <b>R$ ${lucro.toFixed(2)}</b></p>
        <p>🏦 Saldo final: <b>R$ ${saldoFinal.toFixed(2)}</b></p>
    </div>

    <h3 class="titulo-sec">🧾 MOVIMENTAÇÃO DE VENDAS</h3>
`;

/* ================= VENDAS ================= */
if (vendas.length === 0) {
    html += `<p class="vazio">Nenhuma venda registrada.</p>`;
}

vendas.forEach((venda, index) => {

    let itens = "";

    venda.itens.forEach(p => {
        itens += `
            <div class="item-produto">
                ${p.nome} x${p.quantidade}
            </div>
        `;
    });

    html += `
    <div class="venda-card">

        <div class="venda-topo">
            <b>Venda #${index + 1}</b>
            <span>${venda.data}</span>
        </div>

        <div class="venda-itens">
            ${itens}
        </div>

        <div class="venda-footer">
            <span>Compra: R$ ${(venda.valorCompra || 0).toFixed(2)}</span>
            <span>Pago: R$ ${(venda.valorRecebido || 0).toFixed(2)}</span>
            <span>Troco: R$ ${(venda.troco || 0).toFixed(2)}</span>
        </div>

    </div>
    `;
});

/* ================= ATIVIDADE ================= */
html += `
<h3 class="titulo-sec">🧠 ATIVIDADE FINAL</h3>

<div class="atividade">

    <div class="bloco">
        <p><b>1.</b> Quanto o aluno VENDEU no total?</p>
        <p class="linha">______________________________________________</p>
    </div>

    <div class="bloco">
        <p><b>2.</b> Quanto o aluno GASTOU comprando mercadorias?</p>
        <p class="linha">______________________________________________</p>
    </div>

    <div class="bloco">
        <p><b>3.</b> Qual foi o LUCRO final da operação?</p>
        <p class="linha">______________________________________________</p>
    </div>

    <div class="bloco">
        <p><b>4.</b> O resultado foi positivo ou negativo?</p>
        <p class="linha">______________________________________________</p>
    </div>

</div>
`;

/*===QRCODE DO DIPLOMA===*/

html += `
<div class="qr-mini">
    <img
        src="https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(qrUrl)}"
        alt="QR Code do Certificado">
</div>
`;

document.getElementById("conteudoHistorico").innerHTML = html;