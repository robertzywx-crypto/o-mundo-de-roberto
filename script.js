// -----------------------------
// RPG "O MUNDO DE MAGIA" - VERSÃO FINAL REVISADA
// -----------------------------

const player = {
    nome: "Isaac",
    classe: "Espadachim",
    vida: 40,
    maxVida: 40,
    mana: 20,
    maxMana: 20,
    ataque: 7,
    magia: 10,
    nivel: 1
};

const LIMITES = {
    MAX_LEVEL: 75,
    MAX_VIDA: 5000,
    MAX_MANA: 100
};

const magias = {
    "Golpe Flamejante": 25,
    "Corte Congelante": 15,
    "Rajada Sombria": 50
};

const cidades = {
    Frostvale: {
        historia: "Frostvale – A Cidade do Gelo, com ventos cortantes e montanhas geladas.",
        monstros: [{nome:"Lobo de Gelo", vida:90}, {nome:"Golem Congelado", vida:135}],
        chefe: {nome:"Dragão Branco", vida:250},
        historiaPosChefe: "❄️ Após o rugido final do Dragão Branco, o frio intenso de Frostvale parece ceder. O sol brilha pela primeira vez em anos, revelando uma passagem secreta sob o gelo. Você encontrou um antigo mapa que marca a localização do próximo tirano. A cidade está segura."
    },
    Oakheart: {
        historia: "Oakheart – A Cidade das Florestas, árvores antigas e seres místicos.",
        monstros: [{nome:"Goblin Verde", vida:75}, {nome:"Ent da Floresta", vida:150}],
        chefe: {nome:"Guardião Ancestral", vida:300},
        historiaPosChefe: "🌳 A madeira volta a ser verdejante. O Guardião Ancestral se desfaz em sementes de luz que fertilizam toda a floresta. Uma fada surge e te oferece uma Essência de Mana pura."
    },
    Emberforge: {
        historia: "Emberforge – A Cidade do Fogo, vulcões e magma por todos os lados.",
        monstros: [{nome:"Salamandra de Fogo", vida:105}, {nome:"Basilisco Flamejante", vida:165}],
        chefe: {nome:"Titã de Magma", vida:400},
        historiaPosChefe: "🔥 Com a queda do Titã de Magma, o fluxo de lava se acalma. Os ferreiros de Emberforge prometem forjar uma arma lendária para você."
    },
    Stormreach: {
        historia: "Stormreach – Cidade das Tempestades, onde trovões dominam o céu.",
        monstros: [{nome:"Elemental de Trovão", vida:120}, {nome:"Raio Errante", vida:180}],
        chefe: {nome:"Dragão Elétrico", vida:360},
        historiaPosChefe: "⚡ O último trovão do Dragão Elétrico se extingue. A chuva para e um arco-íris colossal cruza o céu. Você absorve essa energia."
    },
    Shadowfen: {
        historia: "Shadowfen – O Pântano das Sombras, o covil final onde o mal supremo aguarda.",
        monstros: [{nome:"Sapo Gigante", vida:90}, {nome:"Serpente Sombria", vida:150}],
        chefe: {nome:"Lorde das Trevas", vida: 1000}, // VIDA AJUSTADA PARA 1000
        historiaPosChefe: `👑 <b>VOCÊ É O CAMPEÃO!</b> 👑<br><br>O 'Lorde das Trevas' se desintegra em poeira cósmica, e o silêncio se instala, profundo e eterno. A escuridão que cobria o Canadá Medieval é finalmente expulsa. Você, Roberto, o Espadachim, completou o impossível. A luz retorna ao mundo por sua causa. Seu nome será cantado em baladas por séculos! O MUNDO DE ROBERTO ESTÁ SALVO!`
    },
    "O Vazio": {
        historia: "O Vazio – O centro da criação, onde a realidade se dobra. O Criador espera.",
        monstros: [{nome:"Gárgula de Realidade", vida:200}, {nome:"Ecos do Tempo", vida:300}],
        chefe: {nome:"O Criador", vida:800},
        historiaPosChefe: "✨ Com a derrota d'O Criador, a realidade estilhaçada se remonta. Você restaurou o equilíbrio fundamental do universo. Parabéns, Roberto! Você venceu o jogo."
    },
    Aethelburg: {
        historia: "Aethelburg – A Capital, lar da Grande Biblioteca e do Conselho.",
        monstros: [], chefe: null, historiaPosChefe: null
    }
};

let inimigoAtual = null;
let filaMonstros = [];
let chefeAtual = null;
let cidadeAtual = null;
let emHistoria = false;

const out = document.getElementById("output");
const btnAtk = document.getElementById("atkBtn");
const btnMag = document.getElementById("magBtn");
const btnDef = document.getElementById("defBtn");
const btnFugir = document.getElementById("fugirBtn");
const btnMapa = document.getElementById("voltarBtn");
const mapaDiv = document.getElementById("mapa");

function log(msg) {
    out.insertAdjacentHTML('beforeend', msg + "<br>");
    out.scrollTop = out.scrollHeight;
}

function mostraStatus() {
    log(`👤 <b>${player.nome}</b> — LVL ${player.nivel}/${LIMITES.MAX_LEVEL} | Vida: ${player.vida}/${player.maxVida} | Mana: ${player.mana}/${player.maxMana}`);
}

function setBotoes(status) {
    btnAtk.disabled = !status; btnMag.disabled = !status;
    btnDef.disabled = !status; btnFugir.disabled = !status;
}

// --- SISTEMA DE SAVE/LOAD ---
function salvarJogo() {
    localStorage.setItem('save_isaac_rpg', JSON.stringify(player));
    log("💾 <b>Jogo Salvo!</b>");
}

function carregarJogo() {
    const save = localStorage.getItem('save_isaac_rpg');
    if (save) {
        Object.assign(player, JSON.parse(save));
        out.innerHTML = "";
        log("📂 <b>Jogo Carregado!</b>");
        mostraStatus();
    } else {
        log("❌ Nenhum save encontrado.");
    }
}

function subirNivel() {
    if (player.nivel >= LIMITES.MAX_LEVEL) return;
    player.nivel++;
    player.maxVida = Math.min(LIMITES.MAX_VIDA, player.maxVida + 50);
    player.vida = player.maxVida;
    player.maxMana = Math.min(LIMITES.MAX_MANA, player.maxMana + 5);
    player.mana = player.maxMana;
    log(`🌟 <b>LEVEL UP!</b> Você subiu para o Nível ${player.nivel}!`);
    salvarJogo();
}

function inimigoAtaca() {
    if (!inimigoAtual) return;
    let dano = (inimigoAtual.nome === "Lorde das Trevas") ? 15 : (Math.floor(Math.random() * 8) + 3);
    player.vida -= dano;
    log(`💥 ${inimigoAtual.nome} atacou e causou ${dano} de dano!`);
    if (player.vida <= 0) {
        log("💀 O mundo escureceu para Isaac... Carregue seu save.");
        setBotoes(false);
    }
    mostraStatus();
}

function atacar() {
    if (emHistoria || !inimigoAtual) return;
    let dano = Math.floor(Math.random() * 5) + player.ataque;
    inimigoAtual.vida -= dano;
    log(`🗡️ Você causou ${dano} de dano!`);
    if (inimigoAtual.vida <= 0) {
        log(`🎉 ${inimigoAtual.nome} derrotado!`);
        subirNivel(); proximoInimigo();
    } else { inimigoAtaca(); }
}

function usarMagia() {
    if (emHistoria || !inimigoAtual) return;
    if (player.mana < 5) { log("❌ Mana insuficiente!"); return; }
    const nomesMagias = Object.keys(magias);
    const mNome = nomesMagias[Math.floor(Math.random() * nomesMagias.length)];
    const mDano = magias[mNome];
    player.mana -= 5;
    inimigoAtual.vida -= mDano;
    log(`✨ Você usou <b>${mNome}</b> e causou ${mDano} de dano!`);
    if (inimigoAtual.vida <= 0) {
        log(`🎉 ${inimigoAtual.nome} derrotado!`);
        subirNivel(); proximoInimigo();
    } else { inimigoAtaca(); }
}

function defender() {
    if (emHistoria || !inimigoAtual) return;
    log("🛡️ Isaac se defende!");
    let reducao = (inimigoAtual.nome === "Lorde das Trevas") ? 10 : 4;
    player.vida -= (1); // Dano mínimo por defender
    log(`🛡️ Dano bloqueado! Você recebeu apenas 1.`);
    mostraStatus();
}

function fugir() {
    if (Math.random() < 0.5) {
        log("🏃 Fuga com sucesso!");
        inimigoAtual = null; setBotoes(false);
    } else {
        log("❌ Fuga falhou!");
        inimigoAtaca();
    }
}

function proximoInimigo() {
    const info = cidades[cidadeAtual];
    if (filaMonstros.length > 0) {
        inimigoAtual = { ...filaMonstros.shift() };
        log(`⚔️ Inimigo: ${inimigoAtual.nome} (Vida: ${inimigoAtual.vida})`);
    } else if (chefeAtual) {
        log("⚠️ <b>O CHEFE APARECEU!</b>");
        inimigoAtual = { ...chefeAtual }; chefeAtual = null;
    } else {
        emHistoria = true; setBotoes(false);
        log(`<br>${info.historiaPosChefe}<br>`);
        const b = document.createElement("button");
        b.textContent = "Continuar Jornada"; b.onclick = () => btnMapa.click();
        mapaDiv.innerHTML = ""; mapaDiv.appendChild(b);
    }
}

function visitarCidade(nome) {
    out.innerHTML = ""; cidadeAtual = nome; emHistoria = false;
    log(`🏙️ ${cidades[nome].historia}`);
    mapaDiv.innerHTML = "";
    if (nome === "Aethelburg") {
        log("📜 O velho bibliotecário diz: 'Bem-vindo, Isaac. Nem todo livro quer ser lido... alguns preferem observar'.");
        player.vida = player.maxVida; player.mana = player.maxMana;
        log("💖 Vida e Mana restauradas!");
        setBotoes(false); mostraStatus();
    } else {
        filaMonstros = [...cidades[nome].monstros];
        chefeAtual = cidades[nome].chefe ? { ...cidades[nome].chefe } : null;
        proximoInimigo(); setBotoes(true);
    }
}

function iniciarJogo() {
    out.innerHTML = "";
    log("=========================================");
    log("=== BEM-VINDO AO MUNDO DE MAGIA! ===");
    log("=========================================");
    log("⚔️ Sua missão, você, o Espadachim Lendário, é libertar a terra e derrotar os tiranos.");
    log("❄️ Explore o **Canadá Medieval** e torne-se uma lenda.");
    log("👑 Seu ponto de partida é Aethelburg. Use o botão 'Mapa' para começar sua jornada!");
    mostraStatus(); setBotoes(false);
}

btnAtk.onclick = atacar; btnMag.onclick = usarMagia;
btnDef.onclick = defender; btnFugir.onclick = fugir;
btnMapa.onclick = () => {
    out.innerHTML = ""; log("🌍 Escolha uma cidade:");
    mapaDiv.innerHTML = "";
    Object.keys(cidades).forEach(c => {
        const b = document.createElement("button");
        b.textContent = c; b.onclick = () => visitarCidade(c);
        mapaDiv.appendChild(b);
    });
};

// Vinculação opcional de botões de save/load no HTML
if(document.getElementById("saveBtn")) document.getElementById("saveBtn").onclick = salvarJogo;
if(document.getElementById("loadBtn")) document.getElementById("loadBtn").onclick = carregarJogo;

iniciarJogo();
