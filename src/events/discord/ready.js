import logger from '../../utils/logger.js';
import 'dotenv/config';

export default {
    name: 'ready',
    once: true,
    async execute(client) {
        logger.info(`¡${client.user.tag} está listo!`);
                
        await client.lavalinkManager.init({
            id: client.user.id,
            username: client.user.username,
        });
    },
};