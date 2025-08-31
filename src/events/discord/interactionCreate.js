import logger from '../../utils/logger.js';

export default {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            logger.warn(`No se encontró un comando para la interacción: ${interaction.commandName}`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            logger.error(`Error al ejecutar el comando '${interaction.commandName}': ${error.message}`);
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ content: 'Hubo un error al ejecutar el comando!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Hubo un error al ejecutar el comando!', ephemeral: true });
            }
        }
    },
};