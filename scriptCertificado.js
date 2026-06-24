const params = new URLSearchParams(window.location.search);

const nome = params.get("nome") || "Aluno(a)";
const turma = params.get("turma") || "";

const dataAtual = new Date().toLocaleDateString("pt-BR");

document.getElementById("certificado").innerHTML = `
<div class="diploma">

    <div class="canto canto-superior"></div>
    <div class="canto canto-inferior"></div>

    <img src="img/logo-escola.png" class="logo">

    <h1>EMAB</h1>
    <h2>Sistema Monetário</h2>

    <div class="ornamento"></div>

    <h3>CERTIFICADO DIGITAL</h3>

    <p>
        Certificamos que o(a) <b>${nome}</b>,
        da turma <b>${turma}</b>,
        concluiu com êxito as atividades do projeto
        <b>Sistema Monetário</b> em <b>${dataAtual}</b>.
    </p>

    <p>
        Durante as atividades, demonstrou competências em educação financeira,
        cálculo de troco, organização de valores monetários, controle de vendas,
        tomada de decisões e uso consciente do dinheiro em situações práticas
        do cotidiano.
    </p>

    <p>
        Este certificado é concedido em reconhecimento ao empenho,
        participação e desenvolvimento das habilidades trabalhadas ao longo do projeto.
    </p>

    <div class="assinatura-aluno">
        ${nome}
    </div>

    <div class="linha-assinatura"></div>

    <div class="assinatura-escola">
        Atenciosamente,<br>
        <strong>Gestão Pedagógica</strong>
    </div>

</div>
`;