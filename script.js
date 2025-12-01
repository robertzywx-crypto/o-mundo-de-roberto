%%javascript
// COPIE E COLE AQUI TODO O SEU CÓDIGO JAVASCRIPT
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
// Limites Máximos (CAPS) DEFINIDOS PELO JOGADOR
// -----------------------------
const LIMITES = {
    MAX_LEVEL: 50,
    MAX_VIDA: 7000,
    MAX_MANA: 75
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
// Cidades e monstros (CHEFE FINAL: LORDE DAS TREVAS)
// -----------------------------
const cidades = {
    Frostvale: {
        historia: "Frostvale – A Cidade do Gelo, com ventos cortantes e montanhas geladas.",
        monstros: [
            {nome:"Lobo de Gelo", vida:90},
            {nome:"Golem Congelado", vida:135}
        ],
        chefe: {nome:"Dragão Branco", vida:250},
        historiaPosChefe: "❄️ Após o rugido final do Dragão Branco, o frio intenso de Frostvale parece ceder. O sol brilha pela primeira vez em anos, revelando uma passagem secreta sob o gelo. Você encontrou um antigo mapa que marca a localização do próximo tirano. A cidade está segura. (Recompensa: Nível Up)"
    },
    Oakheart: {
        historia: "Oakheart – A Cidade das Florestas, árvores antigas e seres místicos.",
        monstros: [
            {nome:"Goblin Verde", vida:75},
            {nome:"Ent da Floresta", vida:150}
        ],
        chefe: {nome:"Guardião Ancestral", vida:300},
        historiaPosChefe: "🌳 A madeira volta a ser verdejante. O Guardião Ancestral se desfaz em sementes de luz que fertilizam toda a floresta. Uma fada surge, agradecida, e te oferece uma Essência de Mana pura, sentindo que sua jornada está apenas começando. (Recompensa: Nível Up)"
    },
    Emberforge: {
        historia: "Emberforge – A Cidade do Fogo, vulcões e magma por todos os lados.",
        monstros: [
            {nome:"Salamandra de Fogo", vida:105},
            {nome:"Basilisco Flamejante", vida:165}
        ],
        chefe: {nome:"Titã de Magma", vida:400},
        historiaPosChefe: "🔥 Com a queda do Titã de Magma, o fluxo de lava se acalma. Os ferreiros de Emberforge, livres do calor opressor, prometem forjar uma arma lendária para você, assim que a paz retornar a todo o Canadá Medieval. Você sente sua força interior aquecer. (Recompensa: Nível Up)"
    },
    Stormreach: {
        historia: "Stormreach – Cidade das Tempestades, onde trovões dominam o céu.",
        monstros: [
            {nome:"Elemental de Trovão", vida:120},
            {nome:"Raio Errante", vida:180}
        ],
        chefe: {nome:"Dragão Elétrico", vida:360},
        historiaPosChefe: "⚡ O último trovão do Dragão Elétrico se extingue. A chuva para e um arco-íris colossal cruza o céu. Um ancião da cidade revela que o dragão era a fonte de um poder destrutivo que, agora livre, pode ser usado para o bem. Você absorve essa energia. (Recompensa: Nível Up)"
    },
    Shadowfen: {
        historia: "Shadowfen – O Pântano das Sombras, o covil final onde o mal supremo aguarda para extinguir a luz.",
        monstros: [
            {nome:"Sapo Gigante", vida:90},
            {nome:"Serpente Sombria", vida:150}
        ],
        // REQUISITO: O LORDE DAS TREVAS
        chefe: {nome:"Lorde das Trevas", vida:5000},
        historiaPosChefe: "👑 **VOCÊ É O CAMPEÃO!** 👑<br><br>O 'Lorde das Trevas' se desintegra em poeira cósmica, e o silêncio se instala, profundo e eterno. A escuridão que cobria o Canadá Medieval é finalmente expulsa. Você, Roberto, o Espadachim, completou o impossível. **A luz retorna ao mundo por sua causa.** Seu nome será cantado em baladas por séculos, pois você não apenas salvou o reino, mas reescreveu o destino. Você é a lenda. **O MUNDO DE ROBERTO ESTÁ SALVO!**"
    },
    "O Vazio": {
        historia: "O Vazio – O centro da criação, onde a realidade se dobra. O ar aqui é pesado com a presença de um poder inimaginável. O Criador espera.",
        monstros: [
            {nome:"Gárgula de Realidade", vida:200},
            {nome:"Ecos do Tempo", vida:300}
        ],
        chefe: {nome:"O Criador", vida:800},
        historiaPosChefe: "✨ Com a derrota d'O Criador, a realidade estilhaçada se remonta. Você não libertou apenas o Canadá Medieval, mas restaurou o equilíbrio fundamental do universo. Sua lenda ecoará para sempre. Parabéns, Roberto! Você venceu o jogo."
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
let emHistoria = false;

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

// Verifica se há um jogo salvo para exibir o botão de carregar
const jogoSalvo = localStorage.getItem('roberto_rpg_save');

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
    log(`&#x1F464; ${player.nome} — LVL ${player.nivel}/${LIMITES.MAX_LEVEL} | Vida: ${player.vida}/${player.maxVida} | Mana: ${player.mana}/${player.maxMana}`);
}

function habilitarBotoesCombate(){
    btnAtk.disabled = false;
    btnMag.disabled = false;
    btnDef.disabled = false;
    btnFugir.disabled = false;
    mapaDiv.innerHTML = "";
}

function desabilitarBotoesCombate(){
    btnAtk.disabled = true;
    btnMag.disabled = true;
    btnDef.disabled = true;
    btnFugir.disabled = true;
}

// -----------------------------
// FUNÇÕES DE SALVAR E CARREGAR (NOVO)
// -----------------------------

/**
 * Salva o estado atual do jogo no localStorage.
 */
function salvarJogo(){
    const estadoJogo = {
        player: player,
        cidadeAtual: cidadeAtual,
        filaMonstros: filaMonstros,
        chefeAtual: chefeAtual
    };
    try {
        localStorage.setItem('roberto_rpg_save', JSON.stringify(estadoJogo));
        log("💾 Jogo salvo automaticamente!");
    } catch (e) {
        log("❌ Erro ao salvar o jogo. Seu navegador pode estar bloqueando o localStorage.");
    }
}

/**
 * Carrega o estado do jogo a partir do localStorage.
 */
function carregarJogo(){
    const dadosSalvos = localStorage.getItem('roberto_rpg_save');
    if (!dadosSalvos) {
        log("❌ Não há jogo salvo para carregar.");
        return;
    }

    limpar();
    log("🔄 Carregando jogo salvo...");

    const estadoJogo = JSON.parse(dadosSalvos);

    // Copia propriedades do estado salvo para o objeto player
    Object.assign(player, estadoJogo.player);
    cidadeAtual = estadoJogo.cidadeAtual;
    filaMonstros = estadoJogo.filaMonstros;
    chefeAtual = estadoJogo.chefeAtual;

    log(`✅ Jogo carregado com sucesso! Última cidade visitada: **${cidadeAtual}**.`);
    mostraStatus();
    desabilitarBotoesCombate();

    // Tenta retomar o combate ou a tela da cidade
    if (filaMonstros.length > 0 || chefeAtual) {
        log("Retomando o combate...");
        nextMonstro(false, null, true); // Passa true para indicar que é um carregamento
    } else if (cidadeAtual) {
        // Volta para a tela da cidade se não houver mais monstros/chefe
        visitarCidade(cidadeAtual);
    } else {
        // Se cidadeAtual for nula, volta para o menu principal
        btnMapa.onclick();
    }
}


// -----------------------------
// FUNÇÃO DE PROGRESSÃO (COM VERIFICAÇÃO DE LIMITE/CAP)
// -----------------------------
function subirNivel(){

    // Verifica se já atingiu o nível máximo
    if (player.nivel >= LIMITES.MAX_LEVEL) {
        log("✅ Nível máximo (LVL 50) alcançado! Não há mais progressão de nível.");
        // Cura e restaura mesmo no cap
        player.vida = player.maxVida;
        player.mana = player.maxMana;
        mostraStatus();
        salvarJogo(); // Salva mesmo no cap
        return;
    }

    player.nivel++;

    let aumentoVida = Math.max(1, Math.round(player.maxVida * 0.10));
    let aumentoMana = Math.max(1, Math.round(player.maxMana * 0.05));

    // Aplica o CAP de Vida
    player.maxVida = Math.min(LIMITES.MAX_VIDA, player.maxVida + aumentoVida);
    if (player.maxVida === LIMITES.MAX_VIDA) {
        aumentoVida = LIMITES.MAX_VIDA - (player.maxVida - aumentoVida); // Ajusta a mensagem
    }

    // Aplica o CAP de Mana
    player.maxMana = Math.min(LIMITES.MAX_MANA, player.maxMana + aumentoMana);
    if (player.maxMana === LIMITES.MAX_MANA) {
        aumentoMana = LIMITES.MAX_MANA - (player.maxMana - aumentoMana); // Ajusta a mensagem
    }

    // Cura total
    player.vida = player.maxVida;
    player.mana = player.maxMana;

    log(`🌟 **PARABÉNS!** Você subiu para o Nível ${player.nivel}!`);
    log(`⬆️ +${aumentoVida} Max Vida | +${aumentoMana} Max Mana.`);
    mostraStatus();

    salvarJogo(); // Salvamento automático após subir de nível
}

// -----------------------------
// Gerencia a pausa e a continuação da história
// -----------------------------
function continuarHistoria(){
    emHistoria = false;
    limpar();

    // Condição especial para o Chefe Final
    if (cidadeAtual === "Shadowfen" || cidadeAtual === "O Vazio") {
        log("🎉 FIM DO JOGO! A LENDA DE ROBERTO FOI ESCRITA!");
        desabilitarBotoesCombate();
        btnMapa.disabled = true;
        mapaDiv.innerHTML = "Fim de Jogo. Parabéns!";
        localStorage.removeItem('roberto_rpg_save'); // Remove o save ao terminar
        return;
    }

    log(`🏆 ${cidadeAtual} conquistada! Você está pronto para explorar outra cidade.`);
    btnMapa.onclick();
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
    let dano = 0;
    let acao = "atacou";

    if (inimigoAtual.nome === "Lorde das Trevas") {
        if (Math.random() < 0.4) {
            dano = 1000;
            acao = "lançou Magia da Aniquilação (1000)";
        } else {
            dano = 500;
            acao = "desferiu Golpe Sombrio (500)";
        }
    } else {
        dano = Math.floor(Math.random() * 8) + 3;
    }

    player.vida -= dano;
    log(`💥 ${inimigoAtual.nome} ${acao} e causou ${dano} de dano!`);

    if(player.vida <= 0){
        log("💀 Você foi derrotado... O mundo de Roberto escurece.");
        desabilitarBotoesCombate();
        // Nível é mantido, mas o combate termina
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
        nextMonstro(false, inimigoAtual.nome);
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
        nextMonstro(false, inimigoAtual.nome);
        return;
    }
    inimigoAtaca();
}

function defender(){
    if(!inimigoAtual || emHistoria) return;

    log(`🛡️ Você se defendeu!`);

    let danoBase = 0;
    if (inimigoAtual.nome === "Lorde das Trevas") {
        danoBase = 500;
    } else {
        danoBase = Math.floor(Math.random() * 8) + 3;
    }

    const reducaoEfetiva = inimigoAtual.nome === "Lorde das Trevas" ? 50 : 5;

    const danoFinal = Math.max(0, danoBase - reducaoEfetiva);

    player.vida -= danoFinal;

    log(`🛡️ ${inimigoAtual.nome} atacou. Defesa ativada, você recebeu ${danoFinal} de dano.`);
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
// Sequência de monstros
// -----------------------------
function nextMonstro(fugiu=false, nomeInimigoDerrotado=null, carregamento=false){

    const infoCidade = cidades[cidadeAtual];
    const eraChefe = infoCidade.chefe && nomeInimigoDerrotado === infoCidade.chefe.nome;

    if(filaMonstros.length > 0){
        iniciarCombate(filaMonstros.shift());
        salvarJogo(); // Salva ao iniciar novo combate

    } else if(infoCidade.chefe && chefeAtual && !fugiu){
        log("⚠️ Um CHEFÃO apareceu!");
        iniciarCombate(chefeAtual);
        chefeAtual = null;
        salvarJogo(); // Salva ao iniciar o chefão

    } else if (eraChefe && infoCidade.historiaPosChefe) {

        emHistoria = true;
        desabilitarBotoesCombate();

        log("--- FIM DA BATALHA ---");
        log(`👑 **${nomeInimigoDerrotado} derrotado!**`);
        log("<br>");
        log(infoCidade.historiaPosChefe);
        log("<br>");

        const btnContinuar = document.createElement("button");
        btnContinuar.textContent = (cidadeAtual === "Shadowfen" || cidadeAtual === "O Vazio") ? "Finalizar Jogo" : "Continuar Jornada >";
        btnContinuar.onclick = continuarHistoria;
        mapaDiv.innerHTML = "";
        mapaDiv.appendChild(btnContinuar);
        salvarJogo(); // Salva após derrotar o chefe e antes de entrar na história

    } else if (cidadeAtual && !carregamento) {
        log(`🏆 ${cidadeAtual} explorada! Você está pronto para explorar outra cidade.`);
        desabilitarBotoesCombate();
        salvarJogo(); // Salva ao sair do ciclo de combate da cidade
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

    if (nome === "Aethelburg") {
        log("📜 O velho bibliotecário acena para você.");
        log(" 'Bem-vindo, Roberto. Procure informações sobre as outras cidades no menu 'Mapa'.' ");
        desabilitarBotoesCombate();

        const btnDescansar = document.createElement("button");
        btnDescansar.textContent = "Descansar (HP/MP Full)";
        btnDescansar.onclick = () => {
            player.vida = player.maxVida;
            player.mana = player.maxMana;
            log("💖 Você descansou e recuperou totalmente sua Vida e Mana!");
            mostraStatus();
            salvarJogo(); // Salva após o descanso
        };
        mapaDiv.innerHTML = "";
        mapaDiv.appendChild(btnDescansar);

    } else {
        filaMonstros = [...cidades[nome].monstros];
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

// Função para exibir o mapa
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

    log("=========================================");
    log("=== BEM-VINDO AO MUNDO DE ROBERTO! ===");
    log("=========================================");
    log("<br>");

    log(`📈 **LIMITES DO HERÓI:** Nível Máximo: ${LIMITES.MAX_LEVEL} | Vida Máxima: ${LIMITES.MAX_VIDA} | Mana Máxima: ${LIMITES.MAX_MANA}`);
    log("⚠️ O Lorde das Trevas exige poder máximo. Suba de nível para sobreviver!");
    log("<br>");

    log("❄️ Este é o **Canadá Medieval**, uma terra vasta de gelo, florestas antigas e magia indomável.");
    log("⚔️ Sua missão, Roberto, o Espadachim Lendário, é libertar a terra e derrotar os tiranos.");
    log("👑 Seu ponto de partida é Aethelburg, a Capital pacífica.");
    log("🗺️ Use o botão 'Mapa' para começar sua jornada!");
    log("<br>");

    mostraStatus();
    desabilitarBotoesCombate();

    // Adiciona botão de Carregar se houver save
    if (jogoSalvo) {
        const btnCarregar = document.createElement("button");
        btnCarregar.textContent = "💾 Carregar Jogo Salvo";
        btnCarregar.onclick = carregarJogo;
        mapaDiv.appendChild(btnCarregar);

        // Adiciona botão de Novo Jogo
        const btnNovoJogo = document.createElement("button");
        btnNovoJogo.textContent = "🔁 Novo Jogo";
        btnNovoJogo.onclick = btnMapa.onclick; // Vai direto para o mapa
        mapaDiv.appendChild(btnNovoJogo);
    } else {
         // Se não houver save, vai direto para o mapa/cidades
         btnMapa.onclick();
    }
}

// -----------------------------
// Inicializar jogo
// -----------------------------
iniciarJogo();
