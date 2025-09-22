import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import logger from './utils/logger.js';

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID) {
    logger.error('Asegúrate de tener DISCORD_TOKEN, CLIENT_ID, y GUILD_ID en tu archivo .env');
    process.exit(1);
}

const commands = [];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commandFolders = readdirSync(path.join(__dirname, 'commands'));
for (const folder of commandFolders) {
    const commandFiles = readdirSync(path.join(__dirname, 'commands', folder)).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const commandPath = path.join(__dirname, 'commands', folder, file);
        const command = await import(pathToFileURL(commandPath).href);

        if (command.default?.data) {
            commands.push(command.default.data.toJSON());
        } else {
            logger.warn(`El comando en ${commandPath} no tiene la propiedad "data".`);
        }
    }
}

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
    try {
        logger.info(`Comenzando a registrar ${commands.length} comandos de aplicación (/) en el servidor.`);

        const data = await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands },
        );

        logger.info(`Se registraron exitosamente ${data.length} comandos de aplicación (/).`);
    } catch (error) {
        logger.error(error);
    }
})();