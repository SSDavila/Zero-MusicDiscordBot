import { SlashCommandBuilder } from 'discord.js';
import logger from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Activa o desactiva la repetición de la canción o la cola.')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Elige el modo de repetición.')
                .setRequired(true)
                .addChoices(
                    { name: 'Desactivado', value: 'none' },
                    { name: 'Canción', value: 'track' },
                    { name: 'Cola', value: 'queue' }
                )),
    async execute(interaction) {
        const { guildId, member, client } = interaction;
        const mode = interaction.options.getString('mode');

        const player = client.lavalinkManager.players.get(guildId);
        if (!player) {
            return interaction.reply({ content: 'No hay ninguna canción reproduciéndose en este servidor.', ephemeral: true });
        }

        if (member.voice.channelId !== player.voiceChannelId) {
            return interaction.reply({ content: '¡Debes estar en el mismo canal de voz que el bot para usar este comando!', ephemeral: true });
        }

        try {
            player.loop = mode;

            let responseMessage = '';
            if (mode === 'none') {
                responseMessage = '🔁 La repetición ha sido desactivada.';
            } else if (mode === 'track') {
                responseMessage = '🔂 La repetición de la canción actual ha sido activada.';
            } else {
                responseMessage = '🔁 La repetición de la cola ha sido activada.';
            }
            await interaction.reply({ content: responseMessage });
        } catch (error) {
            logger.error(`Error en el comando loop: ${error.message}`);
            await interaction.reply({ content: 'Hubo un error al intentar cambiar el modo de repetición.', ephemeral: true });
        }
    },
};