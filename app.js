import Discord from "discord.js";
import config from "./src/config.js";
import store from "./src/store.js";
import { getStreams, startupMsg, handleMessage } from "./src/utils.js";

const client = new Discord.Client();

let streams;

client.on("ready", () => {
  store.setItem("clientId", client.user.id);
  streams = getStreams(client.guilds.cache, config);
  for (let stream of streams.values()) {
    let embed = startupMsg(stream);
    stream.channel.send({ embed: embed });
  }
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  if (
    msg.channel.type !== "text" ||
    msg.author.id === client.user.id ||
    !streams.has(msg.guild.id)
  )
    return;

  let stream = streams.get(msg.guild.id);
  if (
    stream.blacklist.includes(msg.channel.id) ||
    stream.blacklist.includes(msg.channel.parentID)
  )
    return;

  stream.channel.send(handleMessage(msg));
});

client.login(process.env.API_TOKEN);
