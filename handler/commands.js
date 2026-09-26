const path = require('path');
const fs = require('fs');
const logger = require('../lib/logger');

/**
 * Dynamically load all commands from the commands/ directory
 */
async function loadCommands() {
  const commands = new Map();
  const commandsDir = path.join(__dirname, '../commands');

  try {
    // Get all category directories
    const categories = fs.readdirSync(commandsDir)
      .filter(file => fs.statSync(path.join(commandsDir, file)).isDirectory());

    for (const category of categories) {
      const categoryPath = path.join(commandsDir, category);
      
      // Get all command files in this category
      const commandFiles = fs.readdirSync(categoryPath)
        .filter(file => file.endsWith('.js'));

      for (const file of commandFiles) {
        try {
          const commandPath = path.join(categoryPath, file);
          const command = require(commandPath);

          // Validate command structure
          if (!command.name || typeof command.execute !== 'function') {
            logger.warn(`❌ Invalid command structure: ${file}`);
            continue;
          }

          // Apply safe default permissions to generated/metadata-light commands.
          const ownerNames = new Set(['block','unblock','broadcast','restart','shutdown','setprefix','setmode','setbotname','setowner','setbio','setstatus','maintenance','private','public','disable','enable','plugin','plugins','load','unload','reload','reloadcmds','stats']);
          const groupAdminNames = new Set(['add','kick','promote','demote','promoteall','demoteall','open','close','lock','unlock','setname','setsubject','setdesc','seticon','setphoto','setsettings','revoke','resetgroup','resetsecurity','welcome','goodbye','mute','unmute','warn','unwarn','unwarnall','warnall','antilink','antibot','antispam','antiflood','antimention','antidelete','antitag','antinsfw','antiraid','antiscam','antinvite','antiinvite','antichange','anticall','antisticker','antivideo','antiimage','antidocument','antiaudio','antinumber','antibadword','antibot']);
          const botAdminNames = new Set(['delete','announce','tagall','hidetag']);
          const inferredPermission = command.permission || (ownerNames.has(command.name) || category === 'owner' ? 'OWNER' : botAdminNames.has(command.name) ? 'BOT_ADMIN' : groupAdminNames.has(command.name) || category === 'admin' || category === 'protection' ? 'GROUP_ADMIN' : undefined);
          commands.set(command.name, {
            ...command,
            ...(inferredPermission ? { permission: inferredPermission } : {}),
            category,
          });

          // Register aliases
          if (command.aliases && Array.isArray(command.aliases)) {
            for (const alias of command.aliases) {
              commands.set(alias, {
                ...command,
                category,
              });
            }
          }

          logger.debug(`Loaded command: ${command.name} (${category})`);

        } catch (error) {
          logger.warn(`Failed to load command ${file}:`, error.message);
        }
      }
    }

    logger.info(`✅ Successfully loaded ${commands.size} commands`);
    return commands;

  } catch (error) {
    logger.error('Failed to load commands:', error);
    throw error;
  }
}

/**
 * Get command by name or alias
 */
function getCommand(commands, name) {
  return commands.get(name?.toLowerCase());
}

/**
 * Get all commands by category
 */
function getCommandsByCategory(commands, category) {
  return Array.from(commands.values())
    .filter(cmd => cmd.category === category)
    .filter((cmd, index, self) => self.findIndex(c => c.name === cmd.name) === index);
}

module.exports = {
  loadCommands,
  getCommand,
  getCommandsByCategory,
};
