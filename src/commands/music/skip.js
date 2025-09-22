import { SlashCommandBuilder } from 'discord.js';
import logger from '../../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Salta la canción actual.'),
  async execute(interaction) {
    const { guildId, member, client } = interaction;

    const player = client.lavalinkManager?.players.get(guildId);
    if (!player || !player.queue?.current) {
      return interaction.reply({ content: 'No hay ninguna canción reproduciéndose en este momento.', flags: 64 });
    }

    if (member.voice.channelId !== player.voiceChannelId) {
      return interaction.reply({ content: '¡Debes estar en el mismo canal de voz que el bot para usar este comando!', flags: 64 });
    }

    try {
      const queueSize = player.queue?.size ?? player.queue?.length ?? player.queue?.tracks?.length ?? 0;
      const repeatIsQueue = player.repeatMode === 'queue' || player.loop === 'queue' || player.loop === 'QUEUE';

      await player.skip(0, false);

      if (queueSize > 0 || repeatIsQueue) {
        await interaction.reply({ content: '⏭️ Canción saltada.' });
      } else {
        await interaction.reply({ content: '⏩ Se saltó la última canción. La cola está vacía.' });
      }
    } catch (error) {
      logger.error(`Error al saltar la canción: ${error?.message ?? error}`);
      await interaction.reply({ content: 'Hubo un error al intentar saltar la canción.', flags: 64 });
    }
  },
};
