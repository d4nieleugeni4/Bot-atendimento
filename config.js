
// ============================================
// CONFIGURAÇÃO FÁCIL DO BOT DE ATENDIMENTO
// ============================================

module.exports = {
  
  // ========== CONFIGURAÇÃO DO BOT ==========
  bot: {
    nome: "Jarvis",  // Nome que aparece do seu bot
    numero: "5511963546094"  // Número do WhatsApp do bot
  },
  
  // ========== CONFIGURAÇÃO DO DONO ==========
  dono: {
    nome: "Proprietário",  // Seu nome
    numero: "5524981321901"  // Seu número de WhatsApp
  },
  
  // ========== CONFIGURAÇÃO DAS LOJAS ==========
  
  // LOJA 1 (quando cliente escolher opção 1)
  loja1: {
    nome: "DN Store 1",  // Nome da sua primeira loja
    telefone: "5521999999999",  // Número da loja 1
    endereco: "Rua Principal, 123 - Centro, Rio de Janeiro",  // Endereço da loja 1
    atendente: "Maria"  // Nome da atendente da loja 1
  },
  
  // LOJA 2 (quando cliente escolher opção 2)
  loja2: {
    nome: "DN Store 2",  // Nome da sua segunda loja
    telefone: "5521988888888",  // Número da loja 2
    endereco: "Avenida Secundária, 456 - Bairro, São Paulo",  // Endereço da loja 2
    atendente: "João"  // Nome da atendente da loja 2
  },
  
  // ========== MENSAGENS PERSONALIZÁVEIS ==========
  mensagens: {
    // Mensagem de boas-vindas quando alguém entra em contato
    boasVindas: "👋 Olá {nome}! Você entrou em contato com a {loja}.\n\nVocê deseja falar com a atendente da *loja 1* ou da *loja 2*?\n\nDigite *1* para Loja 1\nDigite *2* para Loja 2",
    
    // Resposta quando escolher LOJA 1
    respostaLoja1: "✅ *Ótimo! Você escolheu falar com a atendente da {loja1}.*\n\n📞 *Em breve nossa atendente {atendente1} entrará em contato com você.*\n\n📍 *Endereço:* {endereco1}\n\n*Agradecemos seu contato!* 😊\n\n_📌 O bot ficará em silêncio por 5 horas para não atrapalhar o atendimento.\nSe precisar de novo atendimento após esse período, digite *OI*._",
    
    // Resposta quando escolher LOJA 2
    respostaLoja2: "✅ *Ótimo! Você escolheu falar com a atendente da {loja2}.*\n\n📞 *O número da loja 2 é:* {telefone2}\n\n📍 *Endereço:* {endereco2}\n\n*Fale diretamente com nossa equipe!* 😊\n\n_📌 O bot ficará em silêncio por 5 horas.\nSe precisar de novo atendimento após esse período, digite *OI*._",
    
    // Mensagem se não entender a escolha (primeira vez)
    naoEntendeu: "❓ *Desculpe, não entendi sua escolha.*\n\nPor favor, digite:\n\n*1* para falar com a atendente da Loja 1\n\n*OU*\n\n*2* para falar com a atendente da Loja 2",
    
    // Mensagem se ainda não entender depois de pedir novamente
    aindaNaoEntendeu: "🤔 *Parece que você está com dificuldades para escolher.*\n\nPor favor, entre em contato diretamente:\n\n📱 *Loja 1:* {telefone1}\n📱 *Loja 2:* {telefone2}\n\n*Ou visite uma de nossas lojas:*\n📍 {endereco1}\n📍 {endereco2}\n\n_📌 O bot ficará em silêncio por 1 hora.\nPara novo atendimento, digite *OI* após esse período._"
  },
  
  // ========== CONFIGURAÇÕES TÉCNICAS ==========
  configuracoes: {
    modoManutencao: false,  // Coloque "true" para desativar o bot temporariamente
    respostaAutomatica: true,  // O bot responde automaticamente às mensagens
    tempoSilencio: 5,  // Tempo em HORAS que o bot fica em silêncio após atendimento (recomendado: 5)
    
    // Palavras que fazem o bot reiniciar a conversa (não precisa mudar)
    palavrasReiniciar: ['oi', 'ola', 'olá', 'menu', 'atendimento', 'reiniciar', 'começar']
  }
};

// ============================================
// INSTRUÇÕES PARA EDITAR:
// ============================================
// 1. Altere apenas os valores ENTRE ASPAS
// 2. Não apague as vírgulas no final das linhas
// 3. Não altere os nomes antes dos dois pontos (:)
// 4. Use números sem o símbolo de + no início
// 5. {nome} será substituído automaticamente pelo nome do cliente
// 6. {loja1}, {atendente1}, etc. serão substituídos pelos seus dados
// ============================================

