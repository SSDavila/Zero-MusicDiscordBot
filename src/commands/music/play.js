import { SlashCommandBuilder } from 'discord.js';
import logger from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Reproduce una canción o agrega a la cola.')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('El nombre o URL de la canción.')
                .setRequired(true)),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        const { guildId, member, client } = interaction;
        const channelId = member.voice.channelId;

        if (!channelId) {
            return interaction.reply({ content: '¡Debes estar en un canal de voz para usar este comando!', ephemeral: true });
        }

        await interaction.deferReply();

        try {
            const player = await client.lavalinkManager.createPlayer({
                guildId: guildId,
                voiceChannelId: channelId,
                textChannelId: interaction.channel.id,
                selfDeaf: true,
                volume: 50,
            });

            if (!player.connected) {
                await player.connect();
            }

            const result = await player.search(query, { source: "youtube" });

            if (!result || !result.tracks.length) {
                await interaction.editReply({ content: 'No se encontraron resultados para tu búsqueda.' });
                return;
            }
            
            const track = result.tracks[0];
            player.queue.add(track);

            if (!player.playing) {
                await player.play();
                await interaction.editReply({ content: `🎶 Reproduciendo: **${track.info.title}**` });
            } else {
                await interaction.editReply({ content: `✅ Agregado a la cola: **${track.info.title}**` });
            }

        } catch (error) {
            logger.error(`Error en el comando play: ${error.message}`);
            await interaction.editReply({ content: 'Hubo un error al intentar reproducir la canción.' });
        }
    },
};
