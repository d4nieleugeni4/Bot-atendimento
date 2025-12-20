
const config = require("./config.js");

// Objeto para armazenar o estado de cada usuário
const userStates = {};

module.exports = {
  // Função principal de atendimento
  handleAtendimento: async (sock, from, text, sender) => {
    const cleanText = text.toLowerCase().trim();
    const userId = from;
    
    // Inicializa ou obtém o estado do usuário
    if (!userStates[userId]) {
      userStates[userId] = {
        step: "initial",
        storeChoice: null,
        lastInteraction: Date.now(),
        conversationStarted: false,
        silentMode: false,
        silentUntil: 0
      };
    }
    
    const userState = userStates[userId];
    userState.lastInteraction = Date.now();
    
    // Verifica se é o dono
    if (from.includes(config.dono.numero)) {
      await handleOwnerMessage(sock, from, cleanText, sender);
      return;
    }
    
    // Verifica se está em modo silencioso (após escolher loja)
    if (userState.silentMode && Date.now() < userState.silentUntil) {
      // Ainda está no período de silêncio
      if (shouldRestartConversation(cleanText)) {
        // Sai do modo silencioso e reinicia conversa
        userState.silentMode = false;
        userState.silentUntil = 0;
        userState.step = "initial";
        userState.storeChoice = null;
        userState.conversationStarted = false;
        await sendWelcomeMessage(sock, from, sender);
      }
      // Se não for palavra para reiniciar, NÃO RESPONDE
      return;
    } else if (userState.silentMode && Date.now() >= userState.silentUntil) {
      // Período de silêncio acabou, reinicia conversa
      userState.silentMode = false;
      userState.silentUntil = 0;
      userState.step = "initial";
      userState.storeChoice = null;
      userState.conversationStarted = false;
      await sendWelcomeMessage(sock, from, sender);
      return;
    }
    
    // Se a conversa já foi concluída anteriormente e passou muito tempo, reinicia
    if (userState.step === "store_chosen" && !isRecentConversation(userState.lastInteraction)) {
      userState.step = "initial";
      userState.storeChoice = null;
      userState.conversationStarted = false;
      userState.silentMode = false;
      userState.silentUntil = 0;
    }
    
    // Lógica baseada no estado
    switch (userState.step) {
      case "initial":
        if (!userState.conversationStarted) {
          await sendWelcomeMessage(sock, from, sender);
          userState.step = "asking_store";
          userState.conversationStarted = true;
        }
        break;
        
      case "asking_store":
        await handleStoreChoice(sock, from, cleanText, sender, userState);
        break;
        
      case "store_chosen":
        userState.silentMode = true;
        break;
        
      default:
        userState.step = "initial";
        userState.conversationStarted = false;
        userState.silentMode = false;
        userState.silentUntil = 0;
        await sendWelcomeMessage(sock, from, sender);
    }
  },
  
  clearUserState: (userId) => {
    if (userStates[userId]) {
      delete userStates[userId];
    }
  },
  
  getUserStates: () => {
    return userStates;
  }
};

// Verifica se a conversa é recente
function isRecentConversation(lastInteraction) {
  const TEN_MINUTES = 10 * 60 * 1000;
  return Date.now() - lastInteraction < TEN_MINUTES;
}

// Calcula o timestamp para X horas no futuro
function getSilenceTimeFromNow() {
  const hours = config.configuracoes.tempoSilencio;
  return Date.now() + (hours * 60 * 60 * 1000);
}

// Formata tempo restante de silêncio
function formatTimeRemaining(timestamp) {
  const remaining = timestamp - Date.now();
  if (remaining <= 0) return "encerrado";
  
  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  
  return `${hours}h ${minutes}m`;
}

// Verifica se deve reiniciar a conversa
function shouldRestartConversation(text) {
  return config.configuracoes.palavrasReiniciar.some(keyword => text.includes(keyword));
}

// Envia mensagem de boas-vindas
async function sendWelcomeMessage(sock, from, sender) {
  const mensagem = config.mensagens.boasVindas
    .replace(/{nome}/g, sender)
    .replace(/{loja}/g, config.loja1.nome);
  
  await sock.sendMessage(from, { text: mensagem });
}

// Processa a escolha da loja
async function handleStoreChoice(sock, from, choice, sender, userState) {
  switch (choice) {
    case "1":
    case "loja 1":
    case "loja1":
    case "um":
    case "1.":
    case "uma":
      userState.storeChoice = "loja1";
      userState.step = "store_chosen";
      userState.silentMode = true;
      userState.silentUntil = getSilenceTimeFromNow();
      
      const mensagemLoja1 = config.mensagens.respostaLoja1
        .replace(/{loja1}/g, config.loja1.nome)
        .replace(/{atendente1}/g, config.loja1.atendente)
        .replace(/{endereco1}/g, config.loja1.endereco)
        .replace(/{telefone1}/g, config.loja1.telefone)
        .replace(/{nome}/g, sender);
      
      await sock.sendMessage(from, { text: mensagemLoja1 });
      break;
      
    case "2":
    case "loja 2":
    case "loja2":
    case "dois":
    case "2.":
    case "duas":
      userState.storeChoice = "loja2";
      userState.step = "store_chosen";
      userState.silentMode = true;
      userState.silentUntil = getSilenceTimeFromNow();
      
      const mensagemLoja2 = config.mensagens.respostaLoja2
        .replace(/{loja2}/g, config.loja2.nome)
        .replace(/{telefone2}/g, config.loja2.telefone)
        .replace(/{endereco2}/g, config.loja2.endereco)
        .replace(/{atendente2}/g, config.loja2.atendente)
        .replace(/{nome}/g, sender);
      
      await sock.sendMessage(from, { text: mensagemLoja2 });
      break;
      
    default:
      if (!userState.askedForRetry) {
        const mensagemRetry = config.mensagens.naoEntendeu
          .replace(/{telefone1}/g, config.loja1.telefone)
          .replace(/{telefone2}/g, config.loja2.telefone);
        
        await sock.sendMessage(from, { text: mensagemRetry });
        userState.askedForRetry = true;
      } else {
        const mensagemFinal = config.mensagens.aindaNaoEntendeu
          .replace(/{telefone1}/g, config.loja1.telefone)
          .replace(/{telefone2}/g, config.loja2.telefone)
          .replace(/{endereco1}/g, config.loja1.endereco)
          .replace(/{endereco2}/g, config.loja2.endereco);
        
        await sock.sendMessage(from, { text: mensagemFinal });
        userState.step = "store_chosen";
        userState.silentMode = true;
        userState.silentUntil = Date.now() + (60 * 60 * 1000); // 1 hora
      }
      break;
  }
}

// Trata mensagens do dono
async function handleOwnerMessage(sock, from, text, sender) {
  const cleanText = text.toLowerCase().trim();
  
  if (cleanText.includes("reset") || cleanText.includes("limpar")) {
    const count = Object.keys(userStates).length;
    Object.keys(userStates).forEach(key => {
      delete userStates[key];
    });
    await sock.sendMessage(from, { 
      text: `✅ Estados de ${count} usuários resetados com sucesso!`
    });
    return;
  }
  
  if (cleanText.includes("estatisticas") || cleanText.includes("stats")) {
    const totalUsers = Object.keys(userStates).length;
    const silentUsers = Object.values(userStates).filter(state => 
      state.silentMode && Date.now() < state.silentUntil
    ).length;
    
    const loja1Count = Object.values(userStates).filter(state => 
      state.storeChoice === "loja1"
    ).length;
    
    const loja2Count = Object.values(userStates).filter(state => 
      state.storeChoice === "loja2"
    ).length;
    
    await sock.sendMessage(from, { 
      text: `📊 *ESTATÍSTICAS DO BOT*\n\n👥 Usuários totais: ${totalUsers}\n🔇 Em silêncio: ${silentUsers}\n🏪 Loja 1: ${loja1Count} vezes\n🏪 Loja 2: ${loja2Count} vezes\n\n🛠️ *Comandos:*\n• estatisticas\n• silenciosos\n• ajuda\n• reset`
    });
    return;
  }
  
  if (cleanText.includes("ajuda") || cleanText.includes("help")) {
    const helpMessage = `🛠️ *COMANDOS DO DONO*\n\n📊 *estatisticas* - Ver dados do bot\n🔇 *silenciosos* - Ver quem está em silêncio\n🗑️ *reset* - Limpar todos os dados\n⚙️ *config* - Ver configuração atual\n\n📞 *Seus números:*\n• Bot: ${config.bot.numero}\n• Dono: ${config.dono.numero}\n• Loja 1: ${config.loja1.telefone}\n• Loja 2: ${config.loja2.telefone}`;
    
    await sock.sendMessage(from, { text: helpMessage });
    return;
  }
  
  if (cleanText.includes("silenciosos")) {
    const silentUsers = Object.entries(userStates)
      .filter(([_, state]) => state.silentMode && Date.now() < state.silentUntil)
      .map(([userId, state]) => {
        const phone = userId.split('@')[0];
        const timeRemaining = formatTimeRemaining(state.silentUntil);
        const choice = state.storeChoice === "loja1" ? "Loja 1" : "Loja 2";
        return `🔇 ${phone}: ${choice} - ${timeRemaining} restante`;
      })
      .join('\n');
    
    const message = silentUsers.length > 0 
      ? `🔇 *USUÁRIOS EM SILÊNCIO*\n\n${silentUsers}\n\nTotal: ${silentUsers.split('\n').length} usuário(s)`
      : `✅ *Nenhum usuário em modo silêncio no momento.*`;
    
    await sock.sendMessage(from, { text: message });
    return;
  }
  
  if (cleanText.includes("config") || cleanText.includes("configuracao")) {
    const configMessage = `⚙️ *CONFIGURAÇÃO ATUAL*\n\n🤖 *Bot:* ${config.bot.nome}\n👑 *Dono:* ${config.dono.nome}\n🏪 *Loja 1:* ${config.loja1.nome}\n🏪 *Loja 2:* ${config.loja2.nome}\n⏰ *Silêncio:* ${config.configuracoes.tempoSilencio} horas\n🔄 *Status:* ${config.configuracoes.modoManutencao ? "⛔ MANUTENÇÃO" : "✅ ATIVO"}`;
    
    await sock.sendMessage(from, { text: configMessage });
    return;
  }
  
  // Mensagem padrão para o dono
  const ownerMessage = `👑 Olá ${sender}!\n\nO bot *${config.bot.nome}* está funcionando normalmente. 😊\n\n📊 Use *estatisticas* para ver dados\n🛠️ Use *ajuda* para ver comandos`;
  
  await sock.sendMessage(from, { text: ownerMessage });
}

