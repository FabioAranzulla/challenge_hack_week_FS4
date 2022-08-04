const dotenv = require("dotenv");
const Discord = require("discord.js");
const fetch = require("node-fetch");
const trim = (str, max) =>
  str.length > max ? `${str.slice(0, max - 3)}...` : str;
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
dotenv.config();

client.on("ready", () => {
  client.channels.fetch("1002603263679545467").then((channel) => {
    channel.send("Ciao! Sono il tuo bot sulle notizie spaziali :rocket: \n Questi sono i miei comandi:\n - /articles ⇒ ritorna gli ID tutti gli articoli \n - /articles/authors ⇒ ritorna la lista di autori o della provenienza degli articoli \n - /articles/{id} ⇒ ritorna il testo dell’articolo");
  });
});
client.on("ready", () => {
  console.log("Pronto a partire, capo!");
});

client.on("messageCreate", async (msg) => {
  if (msg.content === "/articles/authors") {
    const messages = await fetch(
      "https://api.spaceflightnewsapi.net/v3/articles?_limit=100"
    );
    const data = await messages.json();
    let siteList = [];
    data.forEach((element) => {
      if (!siteList.includes(element.newsSite)) {
        siteList.push(element.newsSite);
      }
    });
    console.log(siteList.join("\n"));
    msg.reply(siteList.join("\n"));
  }
});

client.on("messageCreate", async (msg) => {
  const num = msg.content;
  const onlynum = /\/articles\/[0-9]+/g;
  if (
    msg.content == `/articles/${num.slice(10)}` &&
    msg.content != "/articles/authors" &&
    onlynum.test(msg.content)
  ) {
    const messages = await fetch(
      `https://api.spaceflightnewsapi.net/v3/articles/${num.slice(10)}`
    );
    const data = await messages.json();

    if (data.summary != "") {
      client.channels.fetch("1002603263679545467").then((channel) => {
        const embed = new Discord.MessageEmbed()
          .setColor(0xefff00)
          .setTitle(data.title)
          .setURL(data.url)
          .setAuthor(data.newsSite)
          .addFields({ name: "Summary", value: trim(data.summary, 1024) });
        channel.send({ embeds: [embed] });
      });
    } else {
      client.channels.fetch("1002603263679545467").then((channel) => {
        const embed = new Discord.MessageEmbed()
          .setColor(0xefff00)
          .setTitle(data.title)
          .setURL(data.url)
          .setAuthor(data.newsSite);
        channel.send({ embeds: [embed] });
      });
    }
  }
});

client.on("messageCreate", async (msg) => {
  if (msg.content === "/articles") {
    const messages = await fetch(
      "https://api.spaceflightnewsapi.net/v3/articles?_limit=30"
    );
    const data = await messages.json();
    let siteId = [];
    data.forEach((element) => {
      if (!siteId.includes(element.id)) {
        siteId.push(element.id);
      }
    });
    console.log(siteId);
    msg.reply(siteId.join("\n"));
  }
});

client.login(process.env.TOKEN);
