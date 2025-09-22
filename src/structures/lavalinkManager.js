import { LavalinkManager } from 'lavalink-client';
import logger from '../utils/logger.js';

export default class CustomLavalinkManager extends LavalinkManager {
  constructor(client) {
    const nodes = [
      {
        id: "main",
        host: process.env.LAVALINK_HOST,
        port: Number(process.env.LAVALINK_PORT),
        authorization: process.env.LAVALINK_PASSWORD,
        secure: false,
      },
    ];

    console.log("NODES CONFIG:", nodes);

    super({
      nodes,
      client,
      sendToShard: (guildId, payload) => {
        const guild = client.guilds.cache.get(guildId);
        if (guild) guild.shard.send(payload);
      },
    });

    this.client = client;
  }
}
