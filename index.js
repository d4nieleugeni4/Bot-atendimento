
const path = require("path");
const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const readline = require("readline");
const pino = require("pino");
const { handleCommands } = require("./handleCommands.js");
const { participantsUpdate } = require("./participantsUpdate.js");
const config = require("./config.js");

const question = (string) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(string, (ans) => {
    rl.close();
    resolve(ans);
  }));
};

exports.connect = async () => {
  const { state, saveCreds } = await useMultiFileAuthState(
    path.resolve(__dirname, ".", "assets", "auth", "creds")
  );

  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    printQRInTerminal: false,
    version,
    logger: pino({ level: "silent" }),
    auth: state,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    markOnlineOnConnect: true,
  });

  if (!sock.authState.creds.registered) {
    let phoneNumber = await question("Informe o seu número de telefone: ");
    phoneNumber = phoneNumber.replace(/[^0-9]/g, "");

    if (!phoneNumber) {
      throw new Error("Número de telefone inválido!");
    }

    const code = await sock.requestPairingCode(phoneNumber);
    console.log("Código de pareamento:", code);
  }

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("Conexão fechada devido ao erro:", lastDisconnect.error, "Reconectando...", shouldReconnect);

      if (shouldReconnect) {
        this.connect();
      }
    } else if (connection === "open") {
      console.log("=".repeat(50));
      console.log("✅ BOT CONECTADO COM SUCESSO!");
      console.log("=".repeat(50));
      console.log(`🤖 Nome do Bot: ${config.bot.nome}`);
      console.log(`📞 Número do Bot: ${config.bot.numero}`);
      console.log(`👑 Dono: ${config.dono.nome} (${config.dono.numero})`);
      console.log(`🏪 Loja 1: ${config.loja1.nome}`);
      console.log(`🏪 Loja 2: ${config.loja2.nome}`);
      console.log(`⏰ Silêncio: ${config.configuracoes.tempoSilencio} horas`);
      console.log(`🔧 Status: ${config.configuracoes.modoManutencao ? "MANUTENÇÃO" : "ATIVO"}`);
      console.log("=".repeat(50));
      console.log("📱 Pronto para atendimento automático!");
      console.log("=".repeat(50));
    }
  });

  sock.ev.on("creds.update", saveCreds);

  handleCommands(sock);
  participantsUpdate(sock);
  return sock;
};

this.connect();

