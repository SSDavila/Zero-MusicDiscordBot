import { SlashCommandBuilder } from 'discord.js';
import logger from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Salta la canción actual.'),
    async execute(interaction) {
        const { guildId, member, client } = interaction;

        const player = client.lavalinkManager.players.get(guildId);
        if (!player || !player.playing) {
            return interaction.reply({ content: 'No hay ninguna canción reproduciéndose en este momento.', ephemeral: true });
        }

        if (member.voice.channelId !== player.voiceChannelId) {
            return interaction.reply({ content: '¡Debes estar en el mismo canal de voz que el bot para usar este comando!', ephemeral: true });
        }

        try {
            if (player.queue.current || player.queue.size > 0) {
                await player.skip();
                await interaction.reply({ content: '⏭️ Canción saltada. Reproduciendo la siguiente en la cola.' });
            } else {
                await player.destroy();
                await interaction.reply({ content: '⏩ Se saltó la última canción. La cola está vacía. El bot se ha desconectado.' });
            }
        } catch (error) {
            logger.error(`Error al saltar la canción: ${error.message}`);
            await interaction.reply({ content: 'Hubo un error al intentar saltar la canción.', ephemeral: true });
        }
    },
};