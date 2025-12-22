export default {
  bot: {
    nome: "Jarvis",
    numero: "5511963546094"
  },

  dono: {
    nome: "Proprietário",
    numero: "5524981321901"
  },

  loja1: {
    nome: "DN Store 1",
    telefone: "5521999999999",
    endereco: "Rua Principal, 123 - Centro, Rio de Janeiro",
    atendente: "Maria"
  },

  loja2: {
    nome: "DN Store 2",
    telefone: "5521988888888",
    endereco: "Avenida Secundária, 456 - Bairro, São Paulo",
    atendente: "João"
  },

  mensagens: {
    boasVindas:
      "👋 Olá {nome}! Você entrou em contato com a {loja}.\n\nDigite:\n*1* Loja 1\n*2* Loja 2",

    respostaLoja1:
      "✅ Você escolheu a {loja1}\n📍 {endereco1}\n👩 {atendente1}",

    respostaLoja2:
      "✅ Você escolheu a {loja2}\n📍 {endereco2}\n📞 {telefone2}",

    naoEntendeu:
      "❓ Não entendi. Digite *1* ou *2*",

    aindaNaoEntendeu:
      "🤔 Entre em contato direto:\n{telefone1}\n{telefone2}"
  },

  configuracoes: {
    modoManutencao: false,
    respostaAutomatica: true,
    tempoSilencio: 5,
    palavrasReiniciar: ["oi", "ola", "menu", "atendimento"]
  }
};
