import { EmbedBuilder } from 'discord.js';
import logger from '../../utils/logger.js';

export default {
    name: 'trackStart',
    async execute(player, track) {
        logger.info(`Reproduciendo ${track.info.title} en el servidor ${player.guildId}.`);

        const channel = player.client.channels.cache.get(player.textChannelId);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🎶 Comenzando a reproducir')
            .setDescription(`**[${track.info.title}](${track.info.uri})**\nDuración: \`${track.info.isStream ? '🔴 EN VIVO' : new Date(track.info.length).toISOString().slice(14, 19)}\``)
            .setThumbnail(track.info.thumbnail)
            .setFooter({ text: `Solicitado por: ${track.info.requester.username}` });
        
        await channel.send({ embeds: [embed] });
    },
};