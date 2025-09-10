export default {
  name: "nodeConnect",
  once: false,
  async execute(node) {
    console.log(`🔌 Nodo ${node.id} conectado.`);
  },
};
