
const { handleAtendimento } = require("./atendimento.js");
const config = require("./config.js");

module.exports.handleCommands = (sock) => {
  sock.ev.on("messages.upsert", async (msg) => {
    const m = msg.messages[0];
    if (!m?.message || m.key.fromMe) return;

    const from = m.key.remoteJid;
    const messageType = Object.keys(m.message)[0];
    const text = m.message.conversation || m.message[messageType]?.text || "";
    const sender = m.pushName || "Cliente";

    console.log(`📩 [${new Date().toLocaleTimeString()}] ${sender}: "${text}"`);

    // Verifica se está em modo manutenção
    if (config.configuracoes.modoManutencao) {
      await sock.sendMessage(from, { 
        text: "⏸️ O bot está em manutenção no momento. Por favor, tente novamente mais tarde."
      });
      return;
    }

    // Se resposta automática está ativada, usa o sistema de atendimento
    if (config.configuracoes.respostaAutomatica) {
      await handleAtendimento(sock, from, text, sender);
    }
  });
};

