// -----------------------------
// RPG "O MUNDO DE ROBERTO" - Atualizado
// - Bônus de chefe: história -> depois bônus (+1 nível, +10 vida, +5 mana)
// - Nível máximo aumentado para 70
// - Auto-save silencioso e ordem de cidades mantida
// -----------------------------

// -----------------------------
// Estado do jogador
// -----------------------------
let player = {
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
// Limites / Magias
// -----------------------------
const LIMITES = {
    MAX_LEVEL: 70,    // aumentado para 70 conforme você pediu
    MAX_VIDA: 7000,
    MAX_MANA: 75
};

const magias = {
    "Golpe Flamejante": 20,
    "Corte Congelante": 18,
    "Rajada Sombria": 25
};

// -----------------------------
// Ordem das cidades (a ordem que você pediu)
// -----------------------------
const ordemCidades = [
    "Altenburg",   // 0 - ponto de partida
    "Frostvale",   // 1
    "Oakheart",    // 2
    "Emberforge",  // 3
    "Stormreach",  // 4
    "Shadowfen",   // 5
    "O Vazio"      // 6 - só após Shadowfen
];

// -----------------------------
// Cidades (conteúdo)
// -----------------------------
const cidades = {
    Altenburg: {
        historia: "Altenburg – A Capital pacífica.",
        monstros: [],
        chefe: null,
        historiaPosChefe: null
    },
    Frostvale: {
        historia: "Frostvale – A Cidade do Gelo, com ventos cortantes e montanhas geladas.",
        monstros: [
            {nome:"Lobo de Gelo", vida:90},
            {nome:"Golem Congelado", vida:135}
        ],
        chefe: {nome:"Dragão Branco", vida:250},
        historiaPosChefe: "❄️ Após o rugido final do Dragão Branco, Frostvale respira alívio."
    },
    Oakheart: {
        historia: "Oakheart – A Cidade das Florestas, árvores antigas e seres místicos.",
        monstros: [
            {nome:"Goblin Verde", vida:75},
            {nome:"Ent da Floresta", vida:150}
        ],
        chefe: {nome:"Guardião Ancestral", vida:300},
        historiaPosChefe: "🌳 O Guardião Ancestral se desfaz em sementes de luz."
    },
    Emberforge: {
        historia: "Emberforge – A Cidade do Fogo, vulcões e magma por todos os lados.",
        monstros: [
            {nome:"Salamandra de Fogo", vida:105},
            {nome:"Basilisco Flamejante", vida:165}
        ],
        chefe: {nome:"Titã de Magma", vida:400},
        historiaPosChefe: "🔥 O Titã de Magma foi derrotado — as forjas voltam a trabalhar."
    },
    Stormreach: {
        historia: "Stormreach – Cidade das Tempestades, onde trovões dominam o céu.",
        monstros: [
            {nome:"Elemental de Trovão", vida:120},
            {nome:"Raio Errante", vida:180}
        ],
        chefe: {nome:"Dragão Elétrico", vida:360},
        historiaPosChefe: "⚡ O céu clareia depois da queda do Dragão Elétrico."
    },
    Shadowfen: {
        historia: "Shadowfen – O Pântano das Sombras, o covil do mal que assola a terra.",
        monstros: [
            {nome:"Sapo Gigante", vida:90},
            {nome:"Serpente Sombria", vida:150}
        ],
        chefe: {nome:"Lorde das Trevas", vida:5000},
        historiaPosChefe: "👑 O Lorde das Trevas cai... a luz retorna ao mundo!"
    },
    "O Vazio": {
        historia: "O Vazio – O centro da criação, onde a realidade se dobra.",
        monstros: [
            {nome:"Gárgula de Realidade", vida:200},
            {nome:"Ecos do Tempo", vida:300}
        ],
        chefe: {nome:"O Criador", vida:800},
        historiaPosChefe: "✨ Com a queda do Criador, o universo restaura seu equilíbrio."
    }
};

// -----------------------------
// Estado do combate e progresso
// -----------------------------
let inimigoAtual = null;
let filaMonstros = [];
let chefeAtual = null;
let cidadeAtual = null;        // null até o jogador clicar em Mapa
let progressoCidade = 0;      // índice da ordemCidades (0 = Altenburg desbloqueada)
let ultimoChefeDerrotado = null; // guarda o nome do chefe derrotado para aplicar bônus depois da história

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
// Funções utilitárias (logs e UI)
// -----------------------------
function log(msg){
    out.insertAdjacentHTML('beforeend', msg + "<br>");
    out.scrollTop = out.scrollHeight;
}

function limpar(){
    out.innerHTML = "";
}

function mostraStatus(){
    log(`👤 ${player.nome} — LVL ${player.nivel}/${LIMITES.MAX_LEVEL} | Vida: ${player.vida}/${player.maxVida} | Mana: ${player.mana}/${player.maxMana}`);
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
// Auto-save / Auto-load (silencioso)
// -----------------------------
function salvarJogo(){
    try {
        const saveData = {
            player,
            progressoCidade,
            cidadeAtual,
            filaMonstros,
            chefeAtual,
            ultimoChefeDerrotado
        };
        localStorage.setItem("mundoRobertoSave", JSON.stringify(saveData));
    } catch (e) {
        // silencioso, não mostramos erro
    }
}

function carregarJogo(){
    try {
        const raw = localStorage.getItem("mundoRobertoSave");
        if (!raw) return false;
        const s = JSON.parse(raw);
        Object.assign(player, s.player || {});
        progressoCidade = Number.isInteger(s.progressoCidade) ? s.progressoCidade : progressoCidade;
        cidadeAtual = s.cidadeAtual || null;
        filaMonstros = s.filaMonstros || [];
        chefeAtual = s.chefeAtual || null;
        ultimoChefeDerrotado = s.ultimoChefeDerrotado || null;
        return true;
    } catch (e) {
        return false;
    }
}

// -----------------------------
// FUNÇÃO: aplicar bônus do chefe (aplicada DEPOIS da história e ao clicar "Continuar")
// - +1 nível (até LIMITES.MAX_LEVEL)
// - +10 maxVida (até LIMITES.MAX_VIDA)
// - +5 maxMana (até LIMITES.MAX_MANA)
// - curar até os novos máximos
// -----------------------------
function aplicarBonusChefe() {
    if (!ultimoChefeDerrotado) return;

    // sobe 1 nível (respeitando cap)
    if (player.nivel < LIMITES.MAX_LEVEL) {
        player.nivel = Math.min(LIMITES.MAX_LEVEL, player.nivel + 1);
    }

    // aumenta vida e mana máxima
    player.maxVida = Math.min(LIMITES.MAX_VIDA, player.maxVida + 10);
    player.maxMana = Math.min(LIMITES.MAX_MANA, player.maxMana + 5);

    // cura até máximos
    player.vida = player.maxVida;
    player.mana = player.maxMana;

    log(`🌟 BÔNUS DO CHEFE: Você ganhou +1 Nível, +10 Max Vida e +5 Max Mana!`);
    mostraStatus();

    // guarda nada — já aplicado
    ultimoChefeDerrotado = null;

    // auto-save após aplicar bônus
    salvarJogo();
}

// -----------------------------
// Progressão / Nível auxiliar
// -----------------------------
function subirNivelSimples() {
    if (player.nivel < LIMITES.MAX_LEVEL) {
        player.nivel++;
    }
    // (sem bônus extras — usado apenas se quiser nivelar por outros meios)
}

// -----------------------------
// Funções de Combate
// -----------------------------
function iniciarCombate(monstro){
    inimigoAtual = {...monstro};
    limpar();
    log(`⚔️ Você encontrou ${inimigoAtual.nome} (Vida: ${inimigoAtual.vida})`);
    mostraStatus();
    habilitarBotoesCombate();
}

function inimigoAtaca(){
    if (!inimigoAtual) return;
    let dano = Math.floor(Math.random() * 8) + 3;
    if (inimigoAtual && inimigoAtual.nome === "Lorde das Trevas"){
        dano = Math.random() < 0.33 ? 1000 : 500;
    }
    player.vida -= dano;
    log(`💥 ${inimigoAtual.nome} atacou e causou ${dano} de dano!`);
    if (player.vida <= 0){
        log("💀 Você foi derrotado... O mundo de Roberto escurece.");
        desabilitarBotoesCombate();
        salvarJogo();
        return;
    }
    mostraStatus();
}

function atacar(){
    if(!inimigoAtual) return;
    const dano = Math.floor(Math.random() * 5) + player.ataque;
    inimigoAtual.vida -= dano;
    log(`🗡️ Você atacou ${inimigoAtual.nome} e causou ${dano} de dano!`);

    if (inimigoAtual.vida <= 0){
        // CHECAR SE É CHEFE DA CIDADE ATUAL
        const infoCidade = cidades[cidadeAtual];
        const ehChefe = infoCidade && infoCidade.chefe && inimigoAtual.nome === infoCidade.chefe.nome;

        log(`🎉 Você derrotou ${inimigoAtual.nome}!`);

        if (ehChefe) {
            // salva o nome pra aplicar bónus depois da história
            ultimoChefeDerrotado = inimigoAtual.nome;
            // mostra história do chefe e pausa (nextMonstro fará mostrar a história)
            salvarJogo();
            nextMonstro(true, inimigoAtual.nome); // informa que derrotou este nome
            return;
        } else {
            // inimigo normal derrotado -> sem bônus. apenas continuar.
            salvarJogo();
            nextMonstro(false, inimigoAtual.nome);
            return;
        }
    }

    inimigoAtaca();
}

function magia(){
    if(!inimigoAtual) return;
    if (player.mana < 5){
        log("❌ Mana insuficiente!");
        return;
    }
    const keys = Object.keys(magias);
    const escolha = keys[Math.floor(Math.random()*keys.length)];
    const dano = magias[escolha];
    player.mana -= 5;
    inimigoAtual.vida -= dano;
    log(`✨ Você usou ${escolha} e causou ${dano} de dano!`);

    if (inimigoAtual.vida <= 0){
        const infoCidade = cidades[cidadeAtual];
        const ehChefe = infoCidade && infoCidade.chefe && inimigoAtual.nome === infoCidade.chefe.nome;

        log(`🎉 Você derrotou ${inimigoAtual.nome}!`);

        if (ehChefe) {
            ultimoChefeDerrotado = inimigoAtual.nome;
            salvarJogo();
            nextMonstro(true, inimigoAtual.nome);
            return;
        } else {
            salvarJogo();
            nextMonstro(false, inimigoAtual.nome);
            return;
        }
    }

    inimigoAtaca();
}

function defender(){
    if(!inimigoAtual) return;
    const danoBase = Math.floor(Math.random() * 8) + 3;
    const danoFinal = Math.max(0, danoBase - 5);
    player.vida -= danoFinal;
    log(`🛡️ Você se defendeu e recebeu ${danoFinal} de dano.`);
    if (player.vida <= 0){
        log("💀 Você foi derrotado...");
        desabilitarBotoesCombate();
        salvarJogo();
        return;
    }
    mostraStatus();
}

function fugir(){
    if(!inimigoAtual) return;
    if (Math.random() < 0.5){
        log("🏃 Você fugiu com sucesso!");
        desabilitarBotoesCombate();
        salvarJogo();
        nextMonstro(true);
    } else {
        log("❌ Fuga falhou!");
        inimigoAtaca();
    }
}

// -----------------------------
// Sequência de monstros / chefes (AGORA com história -> depois bônus)
// nextMonstro(fugiu=false, nomeInimigoDerrotado=null)
// -----------------------------
function nextMonstro(fugiu=false, nomeInimigoDerrotado=null){
    const infoCidade = cidades[cidadeAtual];

    // se ainda há monstros na fila
    if (filaMonstros.length > 0){
        iniciarCombate(filaMonstros.shift());
        return;
    }

    // se há chefe definido e não apareceu ainda (chefeAtual guarda o boss antes de iniciar)
    if (infoCidade && infoCidade.chefe && chefeAtual && !fugiu){
        log("⚠️ Um CHEFÃO apareceu!");
        iniciarCombate(chefeAtual);
        // marcar que chefe foi puxado
        chefeAtual = null;
        return;
    }

    // se derrotou o CHEFE (nomeInimigoDerrotado igual ao nome do chefe)
    if (infoCidade && infoCidade.chefe && nomeInimigoDerrotado === infoCidade.chefe.nome && infoCidade.historiaPosChefe){
        // mostrar história do chefe, pausar e só depois de clicar em continuar aplicar o bônus
        desabilitarBotoesCombate();
        log("--- FIM DA BATALHA ---");
        log(`👑 ${nomeInimigoDerrotado} derrotado!`);
        log("<br>");
        log(infoCidade.historiaPosChefe);
        log("<br>");

        // botão Continuar que vai aplicar bônus do chefe e voltar pro mapa
        mapaDiv.innerHTML = "";
        const btnContinuar = document.createElement("button");
        btnContinuar.textContent = (cidadeAtual === "Shadowfen") ? "Finalizar Jogo" : "Continuar Jornada >";
        btnContinuar.onclick = () => {
            // aplicar bônus do chefe (após a história)
            aplicarBonusChefe();
            // avançar progresso da cidade (só agora que o chefe foi vencido)
            const idx = ordemCidades.indexOf(cidadeAtual);
            if (idx === progressoCidade) {
                progressoCidade = Math.min(ordemCidades.length - 1, progressoCidade + 1);
            }
            salvarJogo();
            // se for último chefe, desativa mapa (fim)
            if (cidadeAtual === "Shadowfen") {
                limpar();
                log("🎉 FIM DO JOGO! A LENDA DE ROBERTO FOI ESCRITA!");
                mapaDiv.innerHTML = "Fim de Jogo. Parabéns!";
                desabilitarBotoesCombate();
                btnMapa.disabled = true;
                return;
            }
            // continua pro mapa normalmente
            limpar();
            log(`🏆 ${cidadeAtual} conquistada!`);
            mostrarMapa(); // reexibe mapa
        };
        mapaDiv.appendChild(btnContinuar);
        return;
    }

    // caso final: cidade concluída sem chefe, ou fuga -> apenas marca como concluída se necessário
    if (cidadeAtual){
        log(`🏆 ${cidadeAtual} explorada!`);
        const idx = ordemCidades.indexOf(cidadeAtual);
        if (idx === progressoCidade) {
            progressoCidade = Math.min(ordemCidades.length - 1, progressoCidade + 1);
        }
        salvarJogo();
    }

    desabilitarBotoesCombate();
}

// -----------------------------
// Visitar cidade (bloqueio por ordem)
// -----------------------------
function visitarCidade(nome){
    const idxDesejada = ordemCidades.indexOf(nome);
    if (idxDesejada === -1){
        limpar();
        log("Cidade inválida.");
        return;
    }

    // só permite visitar se idxDesejada <= progressoCidade
    if (idxDesejada > progressoCidade){
        limpar();
        log("🔒 Você ainda não desbloqueou esta cidade.");
        log(`➡️ Primeiro complete: ${ordemCidades[progressoCidade]}`);
        return;
    }

    limpar();
    cidadeAtual = nome;
    salvarJogo(); // salvar ao entrar na cidade

    log(`🏙️ ${cidades[nome].historia}`);
    mostraStatus();

    if (nome === "Altenburg"){
        // Altenburg é capital pacífica — sem combate
        desabilitarBotoesCombate();

        mapaDiv.innerHTML = "";
        const btnDesc = document.createElement("button");
        btnDesc.textContent = "Descansar (HP/MP Full)";
        btnDesc.onclick = () => {
            player.vida = player.maxVida;
            player.mana = player.maxMana;
            salvarJogo();
            limpar();
            log("💖 Você descansou e recuperou totalmente sua Vida e Mana!");
            mostraStatus();
        };
        mapaDiv.appendChild(btnDesc);
        return;
    }

    // cidades com combate
    filaMonstros = [...(cidades[nome].monstros || [])];
    chefeAtual = cidades[nome].chefe ? {...cidades[nome].chefe} : null;
    nextMonstro();
}

// -----------------------------
// BOTÕES e MAPA
// -----------------------------
btnAtk.onclick = atacar;
btnMag.onclick = magia;
btnDef.onclick = defender;
btnFugir.onclick = fugir;

function mostrarMapa(){
    limpar();
    log("🌍 MAPA — clique numa cidade para visitar:");
    mapaDiv.innerHTML = "";
    ordemCidades.forEach(c => {
        const b = document.createElement("button");
        b.textContent = c;
        const idx = ordemCidades.indexOf(c);
        if (idx > progressoCidade) b.disabled = true;
        b.onclick = () => visitarCidade(c);
        mapaDiv.appendChild(b);
    });
}
btnMapa.onclick = mostrarMapa;

// -----------------------------
// Inicialização (mostra o começo — precisa clicar Mapa para começar)
// -----------------------------
function iniciarJogo(){
    carregarJogo(); // tenta carregar silenciosamente (se existir)

    limpar();
    // texto inicial EXACTO que você pediu
    log("Este é o canal medieval, uma terra vasta de gelo, florestas antigas e magia indomável.");
    log("Sua missão, Roberto, o espadachim lendário, é libertar a terra dos tiranos.");
    log("Seu ponto de partida é Altenburg, a capital pacífica.");
    log("Use o botão 'Mapa' para começar sua jornada.");
    log("<br>");
    mostraStatus();
    desabilitarBotoesCombate();
}

iniciarJogo();
