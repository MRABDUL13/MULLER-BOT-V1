const database = require('../../lib/database');

/**
 * EXAMPLE: Command with Database Operations
 * This demonstrates best practices for commands that save/retrieve data
 * 
 * Usage: .notes save [text]     - Save a note
 *        .notes get [id]         - Get a note
 *        .notes list             - List all notes
 *        .notes delete [id]      - Delete a note
 */

module.exports = {
  name: 'notes',
  aliases: ['note', 'memo'],
  category: 'general',
  description: 'Save and manage personal notes',
  usage: '.notes [save|get|list|delete] [args]',
  
  help: `
Personal note management system.

Commands:
  .notes save Text of the note
    Save a new note
    
  .notes list
    Show all your notes
    
  .notes get 1
    Get note with ID 1
    
  .notes delete 1
    Delete note with ID 1

Example:
  .notes save Remember to buy milk
  .notes list
  .notes get 1
`,

  async execute(ctx) {
    try {
      const subCommand = ctx.args[0]?.toLowerCase();
      const params = ctx.args.slice(1);

      switch (subCommand) {
        case 'save':
          return await cmdSaveNote(ctx, params);
        
        case 'list':
          return await cmdListNotes(ctx);
        
        case 'get':
          return await cmdGetNote(ctx, params[0]);
        
        case 'delete':
          return await cmdDeleteNote(ctx, params[0]);
        
        default:
          await ctx.reply(`❌ Unknown notes command
          
Usage: .notes [save|get|list|delete]`);
      }
    } catch (error) {
      await ctx.reply('❌ Failed to process notes command');
    }
  }
};

/**
 * Save a note
 */
async function cmdSaveNote(ctx, params) {
  if (params.length === 0) {
    await ctx.reply('❌ Please provide note text\n\nUsage: .notes save My note here');
    return;
  }

  const noteText = params.join(' ').trim();

  if (noteText.length > 1000) {
    await ctx.reply('❌ Note is too long (max 1000 characters)');
    return;
  }

  // Get or create user's notes
  const userNotes = await database.getBotSettings();
  if (!userNotes.userNotes) {
    userNotes.userNotes = {};
  }

  const userId = ctx.sender;
  if (!userNotes.userNotes[userId]) {
    userNotes.userNotes[userId] = [];
  }

  // Add note with ID
  const noteId = userNotes.userNotes[userId].length + 1;
  userNotes.userNotes[userId].push({
    id: noteId,
    text: noteText,
    created: new Date().toISOString(),
  });

  await database.setBotSetting('userNotes', userNotes.userNotes);
  await ctx.reply(`✅ Note saved (ID: ${noteId})`);
}

/**
 * List all notes
 */
async function cmdListNotes(ctx) {
  const userNotes = await database.getBotSettings();
  const userId = ctx.sender;

  const notes = userNotes?.userNotes?.[userId] || [];

  if (notes.length === 0) {
    await ctx.reply('📝 You have no notes yet\n\nUse: .notes save Text');
    return;
  }

  let response = '📝 Your Notes:\n\n';
  notes.forEach(note => {
    response += `[${note.id}] ${note.text.substring(0, 50)}${note.text.length > 50 ? '...' : ''}\n`;
  });

  await ctx.reply(response);
}

/**
 * Get a note
 */
async function cmdGetNote(ctx, noteId) {
  if (!noteId || isNaN(noteId)) {
    await ctx.reply('❌ Please provide a note ID\n\nUsage: .notes get 1');
    return;
  }

  const userNotes = await database.getBotSettings();
  const userId = ctx.sender;
  const notes = userNotes?.userNotes?.[userId] || [];

  const note = notes.find(n => n.id == noteId);

  if (!note) {
    await ctx.reply(`❌ Note #${noteId} not found`);
    return;
  }

  const response = `📝 Note #${note.id}\n\n${note.text}\n\nCreated: ${new Date(note.created).toLocaleString()}`;
  await ctx.reply(response);
}

/**
 * Delete a note
 */
async function cmdDeleteNote(ctx, noteId) {
  if (!noteId || isNaN(noteId)) {
    await ctx.reply('❌ Please provide a note ID\n\nUsage: .notes delete 1');
    return;
  }

  const userNotes = await database.getBotSettings();
  const userId = ctx.sender;
  
  if (!userNotes.userNotes?.[userId]) {
    await ctx.reply(`❌ Note #${noteId} not found`);
    return;
  }

  const notes = userNotes.userNotes[userId];
  const index = notes.findIndex(n => n.id == noteId);

  if (index === -1) {
    await ctx.reply(`❌ Note #${noteId} not found`);
    return;
  }

  notes.splice(index, 1);
  await database.setBotSetting('userNotes', userNotes.userNotes);
  await ctx.reply(`✅ Note #${noteId} deleted`);
}
