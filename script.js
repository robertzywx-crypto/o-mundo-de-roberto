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
// Cidades e monstros (AGORA COM HISTÓRIAS DOS CHEFES)
// -----------------------------
const cidades = {
    Frostvale: {
        historia: "Frostvale – A Cidade do Gelo, com ventos cortantes e montanhas geladas.",
        monstros: [
            {nome:"Lobo de Gelo", vida:30},
            {nome:"Golem Congelado", vida:45}
        ],
        chefe: {nome:"Dragão Branco", vida:120},
        historiaPosChefe: "❄️ Após o rugido final do Dragão Branco, o frio intenso de Frostvale parece ceder. O sol brilha pela primeira vez em anos, revelando uma passagem secreta sob o gelo. Você encontrou um antigo mapa que marca a localização do próximo tirano. A cidade está segura. (Recompensa: Nível Up)"
    },
    Oakheart: {
        historia: "Oakheart – A Cidade das Florestas, árvores antigas e seres místicos.",
        monstros: [
            {nome:"Goblin Verde", vida:25},
            {nome:"Ent da Floresta", vida:50}
        ],
        chefe: {nome:"Guardião Ancestral", vida:150},
        historiaPosChefe: "🌳 A madeira volta a ser verdejante. O Guardião Ancestral se desfaz em sementes de luz que fertilizam toda a floresta. Uma fada surge, agradecida, e te oferece uma Essência de Mana pura, sentindo que sua jornada está apenas começando. (Recompensa: Nível Up)"
    },
    Emberforge: {
        historia: "Emberforge – A Cidade do Fogo, vulcões e magma por todos os lados.",
        monstros: [
            {nome:"Salamandra de Fogo", vida:35},
            {nome:"Basilisco Flamejante", vida:55}
        ],
        chefe: {nome:"Titã de Magma", vida:200},
        historiaPosChefe: "🔥 Com a queda do Titã de Magma, o fluxo de lava se acalma. Os ferreiros de Emberforge, livres do calor opressor, prometem forjar uma arma lendária para você, assim que a paz retornar a todo o Canadá Medieval. Você sente sua força interior aquecer. (Recompensa: Nível Up)"
    },
    Stormreach: {
        historia: "Stormreach – Cidade das Tempestades, onde trovões dominam o céu.",
        monstros: [
            {nome:"Elemental de Trovão", vida:40},
            {nome:"Raio Errante", vida:60}
        ],
        chefe: {nome:"Dragão Elétrico", vida:180},
        historiaPosChefe: "⚡ O último trovão do Dragão Elétrico se extingue. A chuva para e um arco-íris colossal cruza o céu. Um ancião da cidade revela que o dragão era a fonte de um poder destrutivo que, agora livre, pode ser usado para o bem. Você absorve essa energia. (Recompensa: Nível Up)"
    },
    Shadowfen: {
        historia: "Shadowfen – Pântano das Sombras, criaturas sorrateiras espreitam nas brumas.",
        monstros: [
            {nome:"Sapo Gigante", vida:30},
            {nome:"Serpente Sombria", vida:50}
        ],
        chefe: {nome:"Lorde das Sombras", vida:170},
        historiaPosChefe: "🌑 A névoa do Pântano das Sombras se dissipa. A escuridão que cobria a terra é substituída por uma luz fraca, mas real. Você encontrou um artefato que pertencia ao Lorde, uma gema que brilha, prometendo ser útil contra o mal que resta. (Recompensa: Nível Up)"
    },
    Aethelburg: {
        historia: "Aethelburg – A Capital, lar da Grande Biblioteca e do Conselho. Aqui você encontra paz e informações.",
        monstros: [], 
        chefe: null,
        historiaPosChefe: null
    }
};

// -----------------------------
// Estado do combate
// -----------------------------
let inimigoAtual = null;
let filaMonstros = [];
let chefeAtual = null;
let cidadeAtual = null; 
let emHistoria = false; // NOVO: Flag para pausar o jogo na história

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
    mapaDiv.innerHTML = ""; // Limpa o botão de continuar, se houver
}

function desabilitarBotoesCombate(){
    btnAtk.disabled = true;
    btnMag.disabled = true;
    btnDef.disabled = true;
    btnFugir.disabled = true;
}

// -----------------------------
// FUNÇÃO DE PROGRESSÃO (Nível, Vida e Mana)
// -----------------------------
function subirNivel(){
    // ... (Mantém a lógica de Nível Up)
    player.nivel++;
    
    const aumentoVida = Math.max(1, Math.round(player.maxVida * 0.10)); 
    player.maxVida += aumentoVida;
    
    const aumentoMana = Math.max(1, Math.round(player.maxMana * 0.05)); 
    player.maxMana += aumentoMana;
    
    player.vida = player.maxVida;
    player.mana = player.maxMana;
    
    log(`🌟 **PARABÉNS!** Você subiu para o Nível ${player.nivel}!`);
    log(`⬆️ +${aumentoVida} Max Vida | +${aumentoMana} Max Mana.`);
    mostraStatus();
}

// -----------------------------
// NOVA FUNÇÃO: Gerencia a pausa e a continuação da história
// -----------------------------
function continuarHistoria(){
    emHistoria = false;
    limpar();
    log(`🏆 ${cidadeAtual} conquistada! Você está pronto para explorar outra cidade.`);
    btnMapa.onclick(); // Chama o mapa para o jogador escolher o próximo destino.
}


// -----------------------------
// Combate (ATUALIZADO PARA CHECAR SE ERA UM CHEFE)
// -----------------------------
function iniciarCombate(monstro){
    inimigoAtual = {...monstro};
    limpar();
    log(`⚔️ Você encontrou ${inimigoAtual.nome} (Vida: ${inimigoAtual.vida})`);
    mostraStatus();
    habilitarBotoesCombate();
}

function inimigoAtaca(){
    // ... (Lógica de ataque do inimigo)
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
    if(!inimigoAtual || emHistoria) return;
    const dano = Math.floor(Math.random() * 5) + player.ataque;
    inimigoAtual.vida -= dano;
    log(`🗡️ Você atacou ${inimigoAtual.nome} e causou ${dano} de dano!`);
    if(inimigoAtual.vida <= 0){
        log(`🎉 Você derrotou ${inimigoAtual.nome}!`);
        subirNivel(); 
        nextMonstro(false, inimigoAtual.nome); // NOVO: Passa o nome para checar se era o chefe
        return;
    }
    inimigoAtaca();
}

function magia(){
    if(!inimigoAtual || emHistoria) return;
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
        subirNivel(); 
        nextMonstro(false, inimigoAtual.nome); // NOVO: Passa o nome para checar se era o chefe
        return;
    }
    inimigoAtaca();
}
// ... (defender e fugir permanecem iguais)

function defender(){
    if(!inimigoAtual || emHistoria) return;
    
    log(`🛡️ Você se defendeu!`);
    
    const danoBase = Math.floor(Math.random() * 8) + 3; 
    const danoFinal = Math.max(0, danoBase - 5); 

    player.vida -= danoFinal;
    
    log(`🛡️ ${inimigoAtual.nome} atacou. Dano Bloqueado, você recebeu apenas ${danoFinal} de dano.`);
    if(player.vida <= 0){
        log("💀 Você foi derrotado...");
        desabilitarBotoesCombate();
        return;
    }
    mostraStatus();
}

function fugir(){
    if(!inimigoAtual || emHistoria) return;
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
// Sequência de monstros (ATUALIZADA PARA O CHEFE)
// -----------------------------
function nextMonstro(fugiu=false, nomeInimigoDerrotado=null){
    
    const infoCidade = cidades[cidadeAtual];
    
    // CASO 1: A fila de monstros ainda tem inimigos
    if(filaMonstros.length > 0){
        iniciarCombate(filaMonstros.shift());
    
    // CASO 2: A fila está vazia e o Chefe ainda não apareceu
    } else if(infoCidade.chefe && chefeAtual){ 
        log("⚠️ Um CHEFÃO apareceu!");
        iniciarCombate(chefeAtual);
        chefeAtual = null;
        
    // CASO 3: O Chefe foi derrotado e precisamos exibir a história
    } else if (nomeInimigoDerrotado === infoCidade.chefe.nome && infoCidade.historiaPosChefe) {
        
        emHistoria = true;
        desabilitarBotoesCombate();
        
        // Exibe a história
        log("--- FIM DA BATALHA ---");
        log(`👑 **${nomeInimigoDerrotado} derrotado!**`);
        log("<br>");
        log(infoCidade.historiaPosChefe);
        log("<br>");
        
        // Cria o botão "Continuar"
        const btnContinuar = document.createElement("button");
        btnContinuar.textContent = "Continuar Jornada >";
        btnContinuar.onclick = continuarHistoria;
        mapaDiv.innerHTML = ""; // Limpa botões antigos
        mapaDiv.appendChild(btnContinuar);
        
    // CASO FINAL: Todos os monstros/chefe foram derrotados ou o jogador fugiu
    } else {
        log(`🏆 ${cidadeAtual} explorada! Você está pronto para explorar outra cidade.`);
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
        
        // Adicionando um botão de "Descanso" completo em Aethelburg
        const btnDescansar = document.createElement("button");
        btnDescansar.textContent = "Descansar (HP/MP Full)";
        btnDescansar.onclick = () => {
            player.vida = player.maxVida;
            player.mana = player.maxMana;
            log("💖 Você descansou e recuperou totalmente sua Vida e Mana!");
            mostraStatus();
        };
        mapaDiv.innerHTML = "";
        mapaDiv.appendChild(btnDescansar);
        
    } else {
        // Lógica de combate para cidades normais
        filaMonstros = [...cidades[nome].monstros];
        // Checa se o Chefe ainda existe na estrutura de dados original antes de iniciar
        const bossData = cidades[nome].chefe;
        chefeAtual = bossData ? {...bossData} : null; 
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
// Inicialização e História
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
