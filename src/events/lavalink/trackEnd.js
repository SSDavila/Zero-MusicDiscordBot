import logger from '../../utils/logger.js';

/**
 * Add a track to the queue, try differents methods for compatibility
 * @param {import('lavalink-manager').Queue} queue
 * @param {import('lavalink-manager').Track} track 
 * @param {boolean} [atStart=false] 
 */
function addToQueue(queue, track, atStart = false) {
  if (!queue) return;

  if (atStart) {

    if (typeof queue.unshift === 'function') queue.unshift(track);
    else if (Array.isArray(queue)) queue.unshift(track);
    else if (typeof queue.add === 'function') queue.add(track, 0);
    else if (typeof queue.push === 'function') queue.push(track); 
  } else {

    if (typeof queue.add === 'function') queue.add(track);
    else if (typeof queue.push === 'function') queue.push(track);
    else if (Array.isArray(queue)) queue.push(track);
  }
}

export default {
  name: 'trackEnd',
  async execute(player, track, payload) {
    try {
      if (payload?.reason === 'REPLACED') return;

      const repeatMode = player.repeatMode ?? (player.loop === true ? 'track' : player.loop || 'off');

      if (repeatMode === 'track') {
        addToQueue(player.queue, track, true); // Add at beginning
      } else if (repeatMode === 'queue') {
        addToQueue(player.queue, track, false); // Add at end
      }

      // If the queue isn´t empty and the player isn't stopped, play the next song
      if (!player.playing && !player.paused && player.queue?.size > 0) {
        await player.play();
      }
    } catch (err) {
      logger.error(`trackEnd handler error (guild ${player.guildId}): ${err?.message ?? err}`);
    }
  },
};
