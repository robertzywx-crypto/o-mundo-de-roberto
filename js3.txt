 // -----------------------------
// RPG "O MUNDO DE ROBERTO"
// -----------------------------

// -----------------------------
// Estado do jogador
// -----------------------------
const player = {
    nome: "Roberto",
    classe: "Espadachim",
    vida: 40,
    maxVida: 40,
    mana: 20,
    maxMana: 20,
    ataque: 7,
    magia: 10,
    nivel: 1
};

// -----------------------------
// Magias
// -----------------------------
const magias = {
    "Golpe Flamejante": 20,
    "Corte Congelante": 18,
    "Rajada Sombria": 25
};

// -----------------------------
// Cidades e monstros (Com Aethelburg)
// -----------------------------
const cidades = {
    Frostvale: {
        historia: "Frostvale – A Cidade do Gelo, com ventos cortantes e montanhas geladas.",
        monstros: [
            {nome:"Lobo de Gelo", vida:30},
            {nome:"Golem Congelado", vida:45}
        ],
        chefe: {nome:"Dragão Branco", vida:120}
    },
    Oakheart: {
        historia: "Oakheart – A Cidade das Florestas, árvores antigas e seres místicos.",
        monstros: [
            {nome:"Goblin Verde", vida:25},
            {nome:"Ent da Floresta", vida:50}
        ],
        chefe: {nome:"Guardião Ancestral", vida:150}
    },
    Emberforge: {
        historia: "Emberforge – A Cidade do Fogo, vulcões e magma por todos os lados.",
        monstros: [
            {nome:"Salamandra de Fogo", vida:35},
            {nome:"Basilisco Flamejante", vida:55}
        ],
        chefe: {nome:"Titã de Magma", vida:200}
    },
    Stormreach: {
        historia: "Stormreach – Cidade das Tempestades, onde trovões dominam o céu.",
        monstros: [
            {nome:"Elemental de Trovão", vida:40},
            {nome:"Raio Errante", vida:60}
        ],
        chefe: {nome:"Dragão Elétrico", vida:180}
    },
    Shadowfen: {
        historia: "Shadowfen – Pântano das Sombras, criaturas sorrateiras espreitam nas brumas.",
        monstros: [
            {nome:"Sapo Gigante", vida:30},
            {nome:"Serpente Sombria", vida:50}
        ],
        chefe: {nome:"Lorde das Sombras", vida:170}
    },
    // CIDADE DE INFORMAÇÃO ADICIONADA:
    Aethelburg: {
        historia: "Aethelburg – A Capital, lar da Grande Biblioteca e do Conselho. Aqui você encontra paz e informações.",
        monstros: [], 
        chefe: null
    }
};

// -----------------------------
// Estado do combate
// -----------------------------
let inimigoAtual = null;
let filaMonstros = [];
let chefeAtual = null;
let cidadeAtual = null; 

// -----------------------------
// Referências HTML
// -----------------------------
const out = document.getElementById("output"); 
const btnAtk = document.getElementById("atkBtn");
const btnMag = document.getElementById("magBtn");
const btnDef = document.getElementById("defBtn");
const btnFugir = document.getElementById("fugirBtn");
const btnMapa = document.getElementById("voltarBtn");
const mapaDiv = document.getElementById("mapa");

// -----------------------------
// Funções utilitárias
// -----------------------------
function log(msg){
    out.insertAdjacentHTML('beforeend', msg + "<br>"); 
    out.scrollTop = out.scrollHeight;
}

function limpar(){
    out.innerHTML = "";
}

function mostraStatus(){
    log(`👤 ${player.nome} — LVL ${player.nivel} | Vida: ${player.vida}/${player.maxVida} | Mana: ${player.mana}/${player.maxMana}`);
}

function habilitarBotoesCombate(){
    btnAtk.disabled = false;
    btnMag.disabled = false;
    btnDef.disabled = false;
    btnFugir.disabled = false;
}

function desabilitarBotoesCombate(){
    btnAtk.disabled = true;
    btnMag.disabled = true;
    btnDef.disabled = true;
    btnFugir.disabled = true;
}

// -----------------------------
// Combate
// -----------------------------
function iniciarCombate(monstro){
    inimigoAtual = {...monstro};
    limpar();
    log(`⚔️ Você encontrou ${inimigoAtual.nome} (Vida: ${inimigoAtual.vida})`);
    mostraStatus();
    habilitarBotoesCombate();
}

function inimigoAtaca(){
    const dano = Math.floor(Math.random() * 8) + 3;
    player.vida -= dano;
    log(`💥 ${inimigoAtual.nome} atacou e causou ${dano} de dano!`);
    if(player.vida <= 0){
        log("💀 Você foi derrotado... O mundo de Roberto escurece.");
        desabilitarBotoesCombate();
        return;
    }
    mostraStatus();
}

function atacar(){
    if(!inimigoAtual) return;
    const dano = Math.floor(Math.random() * 5) + player.ataque;
    inimigoAtual.vida -= dano;
    log(`🗡️ Você atacou ${inimigoAtual.nome} e causou ${dano} de dano!`);
    if(inimigoAtual.vida <= 0){
        log(`🎉 Você derrotou ${inimigoAtual.nome}!`);
        nextMonstro();
        return;
    }
    inimigoAtaca();
}

function magia(){
    if(!inimigoAtual) return;
    if(player.mana < 5){
        log("❌ Mana insuficiente!");
        return;
    }
    const keys = Object.keys(magias);
    const magiaEscolhida = keys[Math.floor(Math.random()*keys.length)]; 
    const dano = magias[magiaEscolhida];
    player.mana -= 5;
    inimigoAtual.vida -= dano;
    log(`✨ Você usou ${magiaEscolhida} e causou ${dano} de dano!`);
    if(inimigoAtual.vida <= 0){
        log(`🎉 Você derrotou ${inimigoAtual.nome}!`);
        nextMonstro();
        return;
    }
    inimigoAtaca();
}

function defender(){
    if(!inimigoAtual) return;
    
    const danoBase = Math.floor(Math.random() * 8) + 3; 
    const danoFinal = Math.max(0, danoBase - 5); 

    player.vida -= danoFinal;
    log(`🛡️ Você se defendeu! ${inimigoAtual.nome} atacou. Dano Bloqueado, você recebeu apenas ${danoFinal} de dano.`);
    if(player.vida <= 0){
        log("💀 Você foi derrotado...");
        desabilitarBotoesCombate();
        return;
    }
    mostraStatus();
}

function fugir(){
    if(!inimigoAtual) return;
    if(Math.random() < 0.5){
        log("🏃 Você fugiu com sucesso!");
        desabilitarBotoesCombate();
        nextMonstro(true);
    } else {
        log("❌ Fuga falhou!");
        inimigoAtaca();
    }
}

// -----------------------------
// Sequência de monstros
// -----------------------------
function nextMonstro(fugiu=false){
    if(filaMonstros.length > 0){
        iniciarCombate(filaMonstros.shift());
    } else if(chefeAtual && !fugiu){
        log("⚠️ Um CHEFÃO apareceu!");
        iniciarCombate(chefeAtual);
        chefeAtual = null;
    } else {
        log(`🏆 ${cidadeAtual} conquistada! Você está pronto para explorar outra cidade.`);
        desabilitarBotoesCombate();
    }
}

// -----------------------------
// Cidades (Com lógica para Aethelburg)
// -----------------------------
function visitarCidade(nome){
    limpar();
    cidadeAtual = nome; 
    log(`🏙️ ${cidades[nome].historia}`);
    mostraStatus();

    // Lógica especial para a cidade de informações
    if (nome === "Aethelburg") {
        log("📜 O velho bibliotecário acena para você.");
        log(" 'Bem-vindo, Roberto. Procure informações sobre as outras cidades no menu 'Mapa'.' ");
        desabilitarBotoesCombate();
    } else {
        // Lógica de combate para cidades normais
        filaMonstros = [...cidades[nome].monstros];
        chefeAtual = cidades[nome].chefe;
        nextMonstro();
    }
}

// -----------------------------
// Botões
// -----------------------------
btnAtk.onclick = atacar;
btnMag.onclick = magia;
btnDef.onclick = defender;
btnFugir.onclick = fugir;
btnMapa.onclick = () => {
    limpar();
    log("🌍 Escolha uma cidade para visitar:");
    mapaDiv.innerHTML = "";
    Object.keys(cidades).forEach(c => {
        const b = document.createElement("button");
        b.textContent = c;
        b.onclick = () => visitarCidade(c);
        mapaDiv.appendChild(b);
    });
};

// -----------------------------
// Inicialização e História (AGORA COM O CANADÁ MEDIEVAL)
// -----------------------------
function iniciarJogo(){
    limpar();
    
    // NARRATIVA INICIAL
    log("=========================================");
    log("=== BEM-VINDO AO MUNDO DE ROBERTO! ===");
    log("=========================================");
    log("<br>");
    
    // TEXTO DO CANADÁ MEDIEVAL
    log("❄️ Este é o **Canadá Medieval**, uma terra vasta de gelo, florestas antigas e magia indomável.");
    log("<br>"); 
    
    log("✨ Há rumores de que as cinco grandes cidades-estados foram tomadas por criaturas poderosas.");
    log("⚔️ Sua missão, Roberto, o Espadachim Lendário, é libertar a terra e derrotar os tiranos.");
    log("👑 Seu ponto de partida é Aethelburg, a Capital pacífica.");
    log("🗺️ Use o botão 'Mapa' para começar sua jornada!");
    log("<br>");
    
    mostraStatus();
    desabilitarBotoesCombate();
}

// -----------------------------
// Inicializar jogo
// -----------------------------
iniciarJogo();
