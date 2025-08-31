import logger from '../../utils/logger.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

export default {
    name: 'ready',
    once: true,
    async execute(client) {
        logger.info(`¡${client.user.tag} está listo!`);

        // Inicializar LavalinkManager
        await client.lavalinkManager.init({
            id: client.user.id,
            username: client.user.username,
        });
        logger.info('Conexión con Lavalink establecida.');

        const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
        const commands = [];
        
        // Cargar comandos de la colección del cliente
        client.commands.forEach(command => {
            commands.push(command.data.toJSON());
        });

        try {
            logger.info('Comenzando a registrar comandos de barra diagonal (/).');
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
            logger.info('Comandos registrados exitosamente.');
        } catch (error) {
            logger.error(`Error al registrar comandos: ${error.message}`);
        }
    },
};