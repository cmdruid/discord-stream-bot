/** utils.js **
 * Helper utilities and functions
 * */

export function getStreams(guildCache, config) {
  const streams = new Map();
  for (let guild of guildCache.values()) {
    if (config.has(guild.name)) {
      let guildConfig = config.get(guild.name);
      let streamObj = getChannels(guild.channels.cache, guildConfig);
      streamObj.name = guild.name;
      streamObj.icon = guild.iconURL();
      streams.set(guild.id, streamObj);
    }
  }
  return streams;

  function getChannels(channelCache, guildConfig) {
    let sc,
      cc = 0,
      bl = [];
    for (let channel of channelCache.values()) {
      if (guildConfig.blacklist.includes(channel.name)) {
        bl.push(channel.id);
      } else if (channel.name === guildConfig.streamChannel) {
        sc = channel;
        bl.push(sc.id);
      } else if (channel.type === "text") {
        cc++;
      }
    }
    return { channel: sc, listenCount: cc, blacklist: bl };
  }
}

export function startupMsg(stream) {
  return {
    description: `Now streaming for ${stream.name}! :robot:`,
    footer: {
      icon_url: stream.icon,
      text:
        `Listening to ${stream.listenCount} channels, ` +
        `${stream.blacklist.length} in blacklist.`,
    },
  };
}

export function handleMessage(msg) {
  /**
   * Take an incoming message and craft the return message.
   * */
  const linkTLD = "https://discord.com/channels";
  const msgLink = `${linkTLD}/${msg.guild.id}/${msg.channel.id}/${msg.id}`;
  const attachment = msg.attachments.values().next().value;
  const embed = {
    description: `${msg.content}\n---\n*[Post](${msgLink}) by <@${msg.author.id}> in <#${msg.channel.id}>*`,
  };
  if (msg.member && msg.member.roles.color) {
    embed.color = msg.member.roles.color.color;
  }
  if (attachment) {
    if (attachment.height) {
      embed.thumbnail = { url: attachment.url };
    } else {
      let title = attachment.name,
        url = attachment.url;
      embed.description += `\n\n:paperclip:  [*${title}*](${url})`;
    }
  }
  return { embed: embed };
}
