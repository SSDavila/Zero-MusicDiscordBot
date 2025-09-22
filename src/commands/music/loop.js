import { SlashCommandBuilder } from 'discord.js';
import logger from '../../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Activa o desactiva la repetición de la canción actual.'),
  async execute(interaction) {
    const { guildId, member, client } = interaction;

    const player = client.lavalinkManager?.players.get(guildId);
    if (!player || !player.queue?.current) {
      return interaction.reply({ content: 'No hay ninguna canción reproduciéndose para repetir.', ephemeral: true });
    }

    if (member.voice.channelId !== player.voiceChannelId) {
      return interaction.reply({ content: '¡Debes estar en el mismo canal de voz que el bot para usar este comando!', ephemeral: true });
    }

    try {
      const current = player.repeatMode ?? (player.loop ? 'track' : 'off');

      const newMode = current === 'track' ? 'off' : 'track';

      if (typeof player.setRepeatMode === 'function') {
        await player.setRepeatMode(newMode);
      } else {
        player.repeatMode = newMode;
      }

      const responseMessage = newMode === 'track'
        ? '🔂 Repetición de la canción actual activada.'
        : '❌ Repetición desactivada.';

      await interaction.reply({ content: responseMessage });
    } catch (error) {
      logger.error(`Error en el comando loop (guild ${guildId}): ${error?.message ?? error}`);
      await interaction.reply({ content: 'Hubo un error al intentar cambiar el modo de repetición.', ephemeral: true });
    }
  },
};
