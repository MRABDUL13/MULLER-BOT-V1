const { executeCommand } = require('./command-engine');
function createExecutor(name, category, description) {
  return async function execute(ctx) {
    return executeCommand(name, category, description, ctx);
  };
}
module.exports = { createExecutor };
