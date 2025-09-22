import 'dotenv/config';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

import CustomLavalinkManager from './structures/lavalinkManager.js';
import logger from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

client.commands = new Collection();
client.lavalinkManager = new CustomLavalinkManager(client);

// Load Commands
const commandFolders = readdirSync(path.join(__dirname, 'commands'));
for (const folder of commandFolders) {
    const commandFiles = readdirSync(path.join(__dirname, 'commands', folder)).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const commandPath = path.join(__dirname, 'commands', folder, file);
        const command = await import(pathToFileURL(commandPath).href);

        if (!command?.default?.data?.name) {
            console.warn(`⚠️ El comando ${file} no tiene un export válido, se omitirá.`);
            continue;
        }

        client.commands.set(command.default.data.name, command.default);
    }
}

// Load Events
const eventFolders = readdirSync(path.join(__dirname, 'events'));
for (const folder of eventFolders) {
    const eventFiles = readdirSync(path.join(__dirname, 'events', folder)).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const eventPath = path.join(__dirname, 'events', folder, file);
        const event = await import(pathToFileURL(eventPath).href);

        if (!event?.default?.name || typeof event.default.execute !== "function") {
            console.warn(`⚠️ El evento ${file} no tiene un export válido, se omitirá.`);
            continue;
        }

        const eventHandler = (...args) => event.default.execute(...args);
        if (event.default.once) {
            client.once(event.default.name, eventHandler);
        } else {
            client.on(event.default.name, eventHandler);
        }
    }
}

client.on("raw", d => client.lavalinkManager.sendRawData(d));

client.login(process.env.DISCORD_TOKEN);