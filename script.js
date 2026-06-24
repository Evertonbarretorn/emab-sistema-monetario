let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

renderizar();

function criarUsuario(){

const nome = document.getElementById("nome").value;
const turma = document.getElementById("turma").value;

if(!nome || !turma){
alert("Preencha todos os campos");
return;
}

alunos.push({
id: Date.now(),
nome,
turma
});

localStorage.setItem("alunos", JSON.stringify(alunos));

document.getElementById("nome").value = "";
document.getElementById("turma").value = "";

renderizar();
}

function renderizar(){

document.querySelectorAll("ul").forEach(u => u.innerHTML = "");

document.getElementById("totalAlunos").innerText = alunos.length;

const mapa = {
"3º Ano A": "ano3a",
"3º Ano B": "ano3b",
"4º Ano U": "ano4u",
"5º Ano A": "ano5a",
"5º Ano B": "ano5b"
};

alunos.forEach(aluno => {

const lista = document.getElementById(mapa[aluno.turma]);

if(!lista) return;

lista.innerHTML += `
<li class="list-group-item p-0">
<button class="btn btn-light w-100 text-start"
onclick="entrarAluno(${aluno.id})">
<i class="fa-solid fa-user me-2"></i>
${aluno.nome}
</button>
</li>
`;

});

}

function entrarAluno(id){
localStorage.setItem("alunoAtual", id);
window.location.href = "painelAluno.html";
}   