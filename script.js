// -----------------------------
// RPG "O MUNDO DE MAGIA" - VERSÃO FINAL ABSOLUTA
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
    MAX_LEVEL: 50,
    MAX_VIDA: 5000,
    MAX_MANA: 100
};

const magias = {
    "Golpe Flamejante": 20,
    "Corte Congelante": 18,
    "Rajada Sombria": 25
};

const cidades = {
    Frostvale: {
        historia: "Frostvale – A Cidade do Gelo, com ventos cortantes e montanhas geladas.",
        monstros: [{nome:"Lobo de Gelo", vida:90}, {nome:"Golem Congelado", vida:135}],
        chefe: {nome:"Dragão Branco", vida:250},
        historiaPosChefe: "❄️ Após o rugido final do Dragão Branco, o frio intenso de Frostvale parece ceder. O sol brilha pela primeira vez em anos, revelando uma passagem secreta sob o gelo. Você encontrou um antigo mapa que marca a localização do próximo tirano. A cidade está segura. (Recompensa: Nível Up)"
    },
    Oakheart: {
        historia: "Oakheart – A Cidade das Florestas, árvores antigas e seres místicos.",
        monstros: [{nome:"Goblin Verde", vida:75}, {nome:"Ent da Floresta", vida:150}],
        chefe: {nome:"Guardião Ancestral", vida:300},
        historiaPosChefe: "🌳 A madeira volta a ser verdejante. O Guardião Ancestral se desfaz em sementes de luz que fertilizam toda a floresta. Uma fada surge, agradecida, e te oferece uma Essência de Mana pura. (Recompensa: Nível Up)"
    },
    Emberforge: {
        historia: "Emberforge – A Cidade do Fogo, vulcões e magma por todos os lados.",
        monstros: [{nome:"Salamandra de Fogo", vida:105}, {nome:"Basilisco Flamejante", vida:165}],
        chefe: {nome:"Titã de Magma", vida:400},
        historiaPosChefe: "🔥 Com a queda do Titã de Magma, o fluxo de lava se acalma. Os ferreiros de Emberforge prometem forjar uma arma lendária para você, assim que a paz retornar a todo o Canadá Medieval. (Recompensa: Nível Up)"
    },
    Stormreach: {
        historia: "Stormreach – Cidade das Tempestades, onde trovões dominam o céu.",
        monstros: [{nome:"Elemental de Trovão", vida:120}, {nome:"Raio Errante", vida:180}],
        chefe: {nome:"Dragão Elétrico", vida:360},
        historiaPosChefe: "⚡ O último trovão do Dragão Elétrico se extingue. A chuva para e um arco-íris colossal cruza o céu. Um ancião revela que o dragão era a fonte de um poder destrutivo que agora pode ser usado para o bem. (Recompensa: Nível Up)"
    },
    Shadowfen: {
        historia: "Shadowfen – O Pântano das Sombras, o covil final onde o mal supremo aguarda para extinguir a luz.",
        monstros: [{nome:"Sapo Gigante", vida:90}, {nome:"Serpente Sombria", vida:150}],
        chefe: {nome:"Lorde das Trevas", vida:1000},
        historiaPosChefe: `👑 <b>VOCÊ É O CAMPEÃO!</b> 👑<br><br>O 'Lorde das Trevas' se desintegra em poeira cósmica, e o silêncio se instala, profundo e eterno. A escuridão que cobria o Canadá Medieval é finalmente expulsa. Você, Roberto, o Espadachim, completou o impossível. A luz retorna ao mundo por sua causa. Seu nome será cantado em baladas por séculos, pois você não apenas salvou o reino, mas reescreveu o destino. Você é a lenda. O MUNDO DE ROBERTO ESTÁ SALVO!`
    },
    "O Vazio": {
        historia: "O Vazio – O centro da criação, onde a realidade se dobra. O Criador espera.",
        monstros: [{nome:"Gárgula de Realidade", vida:200}, {nome:"Ecos do Tempo", vida:300}],
        chefe: {nome:"O Criador", vida:800},
        historiaPosChefe: "✨ Com a derrota d'O Criador, a realidade estilhaçada se remonta. Você não libertou apenas o Canadá Medieval, mas restaurou o equilíbrio fundamental do universo. Sua lenda ecoará para sempre. Parabéns, Roberto! Você venceu o jogo."
    },
    Aethelburg: {
        historia: "Aethelburg – A Capital, lar da Grande Biblioteca e do Conselho. Aqui você encontra paz e informações.",
        monstros: [], chefe: null, historiaPosChefe: null
    }
};

let inimigoAtual = null;
let filaMonstros = [];
let chefeAtual = null;
let cidadeAtual = null;
let emHistoria = false;

// Referências HTML
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

function habilitarBotoesCombate(status) {
    btnAtk.disabled = !status; btnMag.disabled = !status;
    btnDef.disabled = !status; btnFugir.disabled = !status;
}

function subirNivel() {
    if (player.nivel >= LIMITES.MAX_LEVEL) {
        log("✅ Nível máximo alcançado!");
        player.vida = player.maxVida; player.mana = player.maxMana;
        return;
    }
    player.nivel++;
    let aumentoVida = Math.round(player.maxVida * 0.10);
    player.maxVida = Math.min(LIMITES.MAX_VIDA, player.maxVida + aumentoVida);
    player.maxMana = Math.min(LIMITES.MAX_MANA, player.maxMana + 5);
    player.vida = player.maxVida; player.mana = player.maxMana;
    log(`🌟 <b>PARABÉNS!</b> Você subiu para o Nível ${player.nivel}!`);
}

function inimigoAtaca() {
    if (!inimigoAtual) return;
    let dano = (inimigoAtual.nome === "Lorde das Trevas") ? (Math.random() < 0.4 ? 1000 : 500) : (Math.floor(Math.random() * 8) + 3);
    player.vida -= dano;
    log(`💥 ${inimigoAtual.nome} atacou e causou ${dano} de dano!`);
    if (player.vida <= 0) {
        log("💀 Você foi derrotado... O mundo de Roberto escurece.");
        habilitarBotoesCombate(false);
    }
    mostraStatus();
}

function atacar() {
    if (emHistoria || !inimigoAtual) return;
    const dano = Math.floor(Math.random() * 5) + player.ataque;
    inimigoAtual.vida -= dano;
    log(`🗡️ Você atacou ${inimigoAtual.nome} e causou ${dano} de dano!`);
    if (inimigoAtual.vida <= 0) {
        log(`🎉 Você derrotou ${inimigoAtual.nome}!`);
        subirNivel(); proximoPasso(inimigoAtual.nome);
    } else { inimigoAtaca(); }
}

function magia() {
    if (emHistoria || !inimigoAtual) return;
    if (player.mana < 5) { log("❌ Mana insuficiente!"); return; }
    const keys = Object.keys(magias);
    const mNome = keys[Math.floor(Math.random() * keys.length)];
    const mDano = magias[mNome];
    player.mana -= 5;
    inimigoAtual.vida -= mDano;
    log(`✨ Você usou <b>${mNome}</b> e causou ${mDano} de dano!`);
    if (inimigoAtual.vida <= 0) {
        log(`🎉 ${inimigoAtual.nome} foi derrotado!`);
        subirNivel(); proximoPasso(inimigoAtual.nome);
    } else { inimigoAtaca(); }
}

function defender() {
    if (emHistoria || !inimigoAtual) return;
    log(`🛡️ Você se defendeu!`);
    let reducao = (inimigoAtual.nome === "Lorde das Trevas") ? 50 : 5;
    let danoInimigo = (inimigoAtual.nome === "Lorde das Trevas") ? 500 : 8;
    let danoFinal = Math.max(0, danoInimigo - reducao);
    player.vida -= danoFinal;
    log(`🛡️ Dano reduzido! Você recebeu ${danoFinal} de dano.`);
    mostraStatus();
}

function fugir() {
    if (Math.random() < 0.5) {
        log("🏃 Você fugiu com sucesso!");
        inimigoAtual = null; habilitarBotoesCombate(false);
    } else {
        log("❌ Fuga falhou!");
        inimigoAtaca();
    }
}

function proximoPasso(nomeMorto) {
    const info = cidades[cidadeAtual];
    if (filaMonstros.length > 0) {
        inimigoAtual = { ...filaMonstros.shift() };
        log(`⚔️ Próximo inimigo: ${inimigoAtual.nome} (Vida: ${inimigoAtual.vida})`);
    } else if (chefeAtual) {
        log("⚠️ <b>O CHEFE DA ÁREA APARECEU!</b>");
        inimigoAtual = { ...chefeAtual }; chefeAtual = null;
    } else {
        emHistoria = true; habilitarBotoesCombate(false);
        log(`<br>${info.historiaPosChefe}<br>`);
        if (cidadeAtual !== "Shadowfen" && cidadeAtual !== "O Vazio") {
            const b = document.createElement("button");
            b.textContent = "Continuar Jornada >";
            b.onclick = () => btnMapa.click();
            mapaDiv.innerHTML = ""; mapaDiv.appendChild(b);
        }
    }
}

function visitarCidade(nome) {
    out.innerHTML = ""; cidadeAtual = nome; emHistoria = false;
    log(`🏙️ ${cidades[nome].historia}`);
    mapaDiv.innerHTML = "";
    if (nome === "Aethelburg") {
        log("📜 O velho bibliotecário acena... 'Bem-vindo, Isaac. Nem todo livro aqui quer ser lido... alguns preferem observar'.");
        player.vida = player.maxVida; player.mana = player.maxMana;
        log("💖 Você descansou e recuperou Vida e Mana!");
        habilitarBotoesCombate(false); mostraStatus();
    } else {
        filaMonstros = [...cidades[nome].monstros];
        chefeAtual = cidades[nome].chefe ? { ...cidades[nome].chefe } : null;
        proximoPasso(); habilitarBotoesCombate(true);
    }
}

function iniciarJogo() {
    out.innerHTML = "";
    log("=========================================");
    log("=== BEM-VINDO AO MUNDO DE MAGIA! ===");
    log("=========================================");
    log(`<br>📈 **LIMITES:** Nível Máximo: ${LIMITES.MAX_LEVEL} | Vida Máxima: ${LIMITES.MAX_VIDA}<br>`);
    log("❄️ Este é o **Canadá Medieval**, uma terra de gelo e magia indomável.");
    log("⚔️ Sua missão, você, o Espadachim Lendário, é libertar a terra e derrotar os tiranos.");
    log("👑 Seu ponto de partida é Aethelburg, a Capital pacífica.");
    log("🗺️ Use o botão 'Mapa' para começar sua jornada!<br>");
    mostraStatus(); habilitarBotoesCombate(false);
}

btnAtk.onclick = atacar; btnMag.onclick = magia;
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

iniciarJogo();
