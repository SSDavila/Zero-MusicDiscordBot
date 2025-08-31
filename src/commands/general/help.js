// src/commands/util/help.js
import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Muestra la lista de comandos disponibles."),
  async execute(interaction) {
    await interaction.reply("Aquí irá la lista de comandos. 🚀");
  },
};
