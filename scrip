// ---------------- JOGO ----------------

let player = {
    nome: "Roberto",
    vida: 40,
    max_vida: 40,
    mana: 20,
    max_mana: 20,
    ataque: 7,
    magia: 10,
    nivel: 1
};

let magias = {
    "Golpe Flamejante": 20,
    "Corte Congelante": 18,
    "Rajada Sombria": 25
};

let cidades = {
    "Frostvale": {
        historia: "Frostvale — A Cidade do Gelo. Prepare-se para monstros gelados!",
        monstros: [["Lobo de Gelo", 30], ["Golem Congelado", 45]],
        boss: ["Dragão Branco", 120]
    },
    "Oakheart": {
        historia: "Oakheart — A Cidade das Florestas. A natureza te desafia!",
        monstros: [["Goblin Verde", 25], ["Ent da Floresta", 50]],
        boss: ["Guardião Ancestral", 150]
    },
    "Emberforge": {
        historia: "Emberforge — A Cidade do Fogo. O calor extremo testa sua coragem!",
        monstros: [["Salamandra de Fogo", 35], ["Basilisco Flamejante", 55]],
        boss: ["Titã de Magma", 200]
    }
};

let historiaDiv = document.getElementById("historia");
let mapaDiv = document.getElementById("mapa");
let batalhaDiv = document.getElementById("batalha");

function mostrarHistoria(texto) {
    historiaDiv.innerHTML = `<p>${texto}</p>`;
}

function limparBatalha() {
    batalhaDiv.innerHTML = "";
}

// Função para mostrar opções do mapa
function mostrarMapa() {
    limparBatalha();
    mapaDiv.innerHTML = "<h2>🌍 Onde você quer ir?</h2>";
    for (let cidade in cidades) {
        let btn = document.createElement("button");
        btn.textContent = cidade;
        btn.onclick = () => visitarCidade(cidade);
        mapaDiv.appendChild(btn);
    }
}

// Função para visitar cidade
function visitarCidade(nome) {
    mostrarHistoria(cidades[nome].historia);
    iniciarBatalhaCidade(nome);
}

// Função de batalha simples
function iniciarBatalhaCidade(nome) {
    limparBatalha();
    let cidade = cidades[nome];
    let inimigos = [...cidade.monstros, cidade.boss];
    let index = 0;

    function batalhar() {
        if (index >= inimigos.length) {
            alert(`🎉 Você derrotou todos em ${nome}!`);
            mostrarMapa();
            return;
        }
        let inimigo = inimigos[index];
        let vidaInimigo = inimigo[1];
        batalhaDiv.innerHTML = `<p>⚔️ Enfrentando: ${inimigo[0]} (Vida: ${vidaInimigo})</p>`;
        let atacarBtn = document.createElement("button");
        atacarBtn.textContent = "Atacar";
        atacarBtn.onclick = () => {
            vidaInimigo -= player.ataque;
            if (vidaInimigo <= 0) {
                alert(`🗡️ Você derrotou ${inimigo[0]}!`);
                index++;
            }
            batalhar();
        };
        batalhaDiv.appendChild(atacarBtn);
    }

    batalhar();
}

// Início do jogo
mostrarHistoria("Bem-vindo ao mundo de Roberto! Sua jornada começa agora.");
mostrarMapa();
