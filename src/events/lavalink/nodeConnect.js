// src/events/lavalink/nodeConnect.js
export default {
  name: "nodeConnect",
  once: false,
  async execute(node) {
    console.log(`🔌 Nodo ${node.id} conectado.`);
  },
};
