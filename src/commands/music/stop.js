import { SlashCommandBuilder } from 'discord.js';
import logger from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Detiene la música y desconecta al bot del canal de voz.'),
    async execute(interaction) {
        const { guildId, member, client } = interaction;

        const player = client.lavalinkManager.players.get(guildId);
        if (!player) {
            return interaction.reply({ content: 'No hay ninguna canción reproduciéndose en este servidor.', ephemeral: true });
        }

        if (member.voice.channelId !== player.voiceChannelId) {
            return interaction.reply({ content: '¡Debes estar en el mismo canal de voz que el bot para usar este comando!', ephemeral: true });
        }

        try {
            player.destroy();
            await interaction.reply({ content: '✅ La reproducción ha sido detenida.' });
        } catch (error) {
            logger.error(`Error al detener la música: ${error.message}`);
            await interaction.reply({ content: 'Hubo un error al intentar detener la música.', ephemeral: true });
        }
    },
};