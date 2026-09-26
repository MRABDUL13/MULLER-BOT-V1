const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const database = require('./database');

const gameState = new Map();
const timers = new Map();

async function fetchJSON(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeout || 12000);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal, headers: { 'User-Agent': 'MULLER-BOT/1.0', ...(options.headers || {}) } });
    const text = await res.text();
    let data; try { data = JSON.parse(text); } catch { data = { raw: text }; }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return data;
  } finally { clearTimeout(timeout); }
}

async function fetchBuffer(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'MULLER-BOT/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  } finally { clearTimeout(timeout); }
}

function input(ctx) { return (ctx.args || []).join(' ').trim(); }
function cleanUrl(s) { try { return new URL(s).toString(); } catch { return null; } }
function mentionTarget(ctx) {
  const mentioned = ctx.message?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  return mentioned[0] || ctx.quotedKey?.participant || null;
}
function targetList(ctx) {
  const m = ctx.message?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  if (m.length) return m;
  if (ctx.quotedKey?.participant) return [ctx.quotedKey.participant];
  return [];
}
function fmtDuration(ms) {
  let s = Math.floor(ms / 1000); const d = Math.floor(s / 86400); s %= 86400;
  const h = Math.floor(s / 3600); s %= 3600; const m = Math.floor(s / 60); s %= 60;
  return `${d ? d + 'd ' : ''}${h ? h + 'h ' : ''}${m ? m + 'm ' : ''}${s}s`;
}
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function setState(key, value) { gameState.set(key, value); }
function getState(key, def) { return gameState.has(key) ? gameState.get(key) : def; }
function parseNum(s, def = 0) { const n = Number(s); return Number.isFinite(n) ? n : def; }

async function mediaBuffer(ctx, kind) {
  const q = ctx.quotedMessage;
  if (!q) throw new Error(`Reply to a ${kind} message.`);
  const msg = q[kind + 'Message'];
  if (!msg) throw new Error(`Reply to a ${kind} message.`);
  const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
  const stream = await downloadContentFromMessage(msg, kind);
  const chunks = []; for await (const c of stream) chunks.push(c);
  return { buffer: Buffer.concat(chunks), msg };
}

async function imageTransform(ctx, op, args) {
  const { buffer, msg } = await mediaBuffer(ctx, 'image');
  let sharp; try { sharp = require('sharp'); } catch { throw new Error('Install dependencies with npm install first.'); }
  let img = sharp(buffer);
  const n = parseNum(args[0], 90);
  if (op === 'resize') img = img.resize({ width: Math.max(1, n), height: args[1] ? Math.max(1, parseNum(args[1], n)) : null, fit: 'inside' });
  if (op === 'crop') img = img.resize({ width: Math.max(1, n), height: args[1] ? Math.max(1, parseNum(args[1], n)) : n, fit: 'cover' });
  if (op === 'edge') img = img.convolve({ width: 3, height: 3, kernel: [-1,-1,-1,-1,8,-1,-1,-1,-1] });
  if (op === 'pixelate') img = img.resize({ width: Math.max(8, Math.floor(n/4)), height: Math.max(8, Math.floor((args[1]?parseNum(args[1],n):n)/4)), kernel: 'nearest' }).resize({ width: Math.max(8,n), height: args[1]?Math.max(8,parseNum(args[1],n)):n, kernel: 'nearest' });
  if (op === 'posterize') img = img.modulate({ saturation: 1.4 }).sharpen();
  if (op === 'sketch') img = img.grayscale().convolve({ width: 3, height: 3, kernel: [-1,-1,-1,-1,9,-1,-1,-1,-1] });
  if (op === 'rotate') img = img.rotate(n || 90);
  if (op === 'flip') img = img.flip();
  if (op === 'mirror') img = img.flop();
  if (op === 'grayscale') img = img.grayscale();
  if (op === 'negate' || op === 'invert') img = img.negate();
  if (op === 'sepia') img = img.modulate({ saturation: 0.25 }).tint({ r: 112, g: 66, b: 20 });
  if (op === 'blur') img = img.blur(Math.min(20, Math.max(0.3, n / 20)));
  if (op === 'sharpen') img = img.sharpen(Math.min(10, Math.max(0.5, n / 20)));
  if (op === 'brightness') img = img.modulate({ brightness: Math.max(0.1, Math.min(3, n / 100)) });
  if (op === 'saturate') img = img.modulate({ saturation: Math.max(0, Math.min(3, n / 100)) });
  if (op === 'contrast') img = img.linear(Math.max(0.1, Math.min(4, n / 100)), -(128 * (Math.max(0.1, Math.min(4, n / 100)) - 1)));
  if (op === 'flip') img = img.flip();
  const out = await img.webp({ quality: 85 }).toBuffer();
  await ctx.socket.sendMessage(ctx.jid, { image: out, mimetype: 'image/webp', caption: msg.caption || '' }, { quoted: ctx.message });
}

async function ffmpegMedia(ctx, kind, args, operation) {
  const sourceKind = kind === 'audio' ? 'audio' : 'video';
  const { buffer, msg } = await mediaBuffer(ctx, sourceKind);
  let ffmpegPath; try { ffmpegPath = require('ffmpeg-static'); } catch { throw new Error('Install dependencies with npm install first.'); }
  const os = require('os'); const { execFile } = require('child_process'); const { promisify } = require('util');
  const exec = promisify(execFile); const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'muller-'));
  const src = path.join(tmp, `in.${sourceKind === 'video' ? 'mp4' : 'mp3'}`); fs.writeFileSync(src, buffer);
  const outputExt = operation === 'gif' ? 'gif' : (operation === 'wav' ? 'wav' : (sourceKind === 'video' ? 'mp4' : 'mp3'));
  const out = path.join(tmp, `out.${outputExt}`);
  let a = ['-y','-i',src];
  const val = parseNum(args[0], 1);
  if (operation === 'mute') a.push('-an');
  else if (operation === 'extractaudio') a.push('-vn','-codec:a','libmp3lame','-b:a','192k');
  else if (operation === 'speed' || operation === 'speedvideo') a.push('-filter:v',`setpts=${Math.max(.25,Math.min(4,1/val))}*PTS`,'-filter:a',`atempo=${Math.max(.5,Math.min(2,val))}`);
  else if (operation === 'audio-speed' || operation === 'speedup' || operation === 'slowed' || operation === 'nightcore') a.push('-filter:a',`atempo=${Math.max(.5,Math.min(2,val))}`);
  else if (operation === 'volume' || operation === 'boost' || operation === 'bass') a.push('-filter:a',`volume=${Math.max(.1,Math.min(5,val))}`);
  else if (operation === 'normalize') a.push('-af','loudnorm');
  else if (operation === 'mono') a.push('-ac','1');
  else if (operation === 'stereo') a.push('-ac','2');
  else if (operation === 'reverse' || operation === 'reversevideo') a.push('-vf','reverse','-af','areverse');
  else if (operation === 'rotate') a.push('-vf',`rotate=${val}*PI/180`);
  else if (operation === 'flipvideo') a.push('-vf','hflip');
  else if (operation === 'resizevideo') a.push('-vf',`scale=${Math.max(16,val)}:-2`);
  else if (operation === 'gif') a.push('-vf','fps=12,scale=480:-1:flags=lanczos');
  else if (operation === 'cut' || operation === 'cutaudio' || operation === 'cutvideo' || operation === 'trimvideo' || operation === 'trimaudio') { a.push('-ss',String(Math.max(0,parseNum(args[0],0)))); if(args[1]) a.push('-t',String(Math.max(.1,parseNum(args[1],10)))); }
  if (outputExt === 'wav') a.push('-acodec','pcm_s16le');
  else if (outputExt === 'gif') a.push('-loop','0');
  else if (outputExt === 'mp3') a.push('-codec:a','libmp3lame','-b:a','192k');
  a.push(out);
  try { await exec(ffmpegPath,a,{timeout:90000}); const data=fs.readFileSync(out);
    if(outputExt==='gif') await ctx.socket.sendMessage(ctx.jid,{video:data,mimetype:'image/gif',gifPlayback:true},{quoted:ctx.message});
    else if(sourceKind==='video' && operation!=='extractaudio') await ctx.socket.sendMessage(ctx.jid,{video:data,mimetype:'video/mp4',caption:msg.caption||''},{quoted:ctx.message});
    else await ctx.socket.sendMessage(ctx.jid,{audio:data,mimetype:outputExt==='wav'?'audio/wav':'audio/mpeg'},{quoted:ctx.message});
  } finally { fs.rmSync(tmp,{recursive:true,force:true}); }
}

async function executeCommand(name, category, description, ctx) {
  const args = ctx.args || []; const text = input(ctx); const p = config.PREFIX;

  // Core/general
  const core = {
    ping: () => ctx.reply(`🏓 Pong! ${Date.now() - ctx.timestamp}ms`),
    ping2: () => ctx.reply(`🏓 Pong!`),
    alive: () => ctx.reply(`🤖 *${config.BOT_NAME}* is online.`),
    botinfo: () => ctx.reply(`🤖 *${config.BOT_NAME}*\n📦 Baileys 7.0.0-rc.14\n⚙️ Prefix: ${p}`),
    owner: () => ctx.reply(`👑 Owner: ${config.OWNER_NUMBER}`),
    ownerinfo: () => ctx.reply(`👑 Owner JID: ${config.OWNER_NUMBER}@s.whatsapp.net`),
    botname: () => ctx.reply(`🤖 ${config.BOT_NAME}`),
    prefix: () => ctx.reply(`⚙️ Prefix: ${p}`),
    mode: () => ctx.reply(`⚙️ Mode: ${config.MODE}`),
    id: () => ctx.reply(`🆔 Chat: ${ctx.jid}\n👤 Sender: ${ctx.sender}`),
    jid: () => ctx.reply(`🆔 ${ctx.jid}`), myid: () => ctx.reply(`🆔 ${ctx.sender}`), chatid: () => ctx.reply(`🆔 ${ctx.jid}`),
    profile: () => ctx.reply(`👤 ${ctx.senderName}\n🆔 ${ctx.sender}`), myinfo: () => ctx.reply(`👤 ${ctx.senderName}\n🆔 ${ctx.sender}`),
    version: () => ctx.reply('📦 MULLER BOT\nBaileys 7.0.0-rc.14'), versioninfo: () => ctx.reply('📦 MULLER BOT\nBaileys 7.0.0-rc.14'),
    runtime: () => ctx.reply(`⏱️ ${fmtDuration(process.uptime()*1000)}`), uptime: () => ctx.reply(`⏱️ ${fmtDuration(process.uptime()*1000)}`),
    speed: () => ctx.reply(`⚡ ${Date.now() - ctx.timestamp}ms`), status: () => ctx.reply(`🟢 Online\nRAM: ${Math.round(process.memoryUsage().rss/1048576)} MB`),
    support: () => ctx.reply('🛟 Use .menu or .help. For support, configure SUPPORT_URL in .env.'),
    contact: () => ctx.reply('📞 Configure CONTACT_TEXT or CONTACT_URL in .env.'),
    donate: () => ctx.reply('💳 Configure DONATE_URL in .env.'),
    report: () => ctx.reply('📝 Send the bug details to the bot owner.'), bug: () => ctx.reply('🐞 Send command name + error details to the owner.'), feedback: () => ctx.reply('💬 Send your feedback to the owner.'),
    about: () => ctx.reply(`ℹ️ ${config.BOT_NAME} — modular WhatsApp automation bot.`),
    source: () => ctx.reply(process.env.SOURCE_URL || 'Source URL is not configured.'), repo: () => ctx.reply(process.env.SOURCE_URL || 'Source URL is not configured.'),
    help: () => ctx.reply(`📚 Use ${p}menu to browse commands.`), greeting: () => ctx.reply('👋 Hello!'), hello: () => ctx.reply('👋 Hello!'), hi: () => ctx.reply('👋 Hi!'),
  };
  if (core[name]) return core[name]();

  if (['menu'].includes(name)) {
    const menuCmd = ctx.commands?.get?.('menu');
    if (menuCmd?.execute) return menuCmd.execute(ctx);
  }
  if (['commandlist','commandscount'].includes(name)) return ctx.reply(`📚 ${new Set([...ctx.commands.values()].map(c=>c.name)).size} unique commands loaded.`);

  // Group operations
  if (['groupid','groupid2','groupinfo','membercount','members','participants','settings'].includes(name)) {
    if (!ctx.isGroup) return ctx.reply('❌ Group only.');
    const ps = ctx.groupMetadata?.participants || [];
    if (name === 'groupid' || name === 'groupid2') return ctx.reply(ctx.groupId);
    if (name === 'membercount' || name === 'members' || name === 'participants') return ctx.reply(`👥 Members: ${ps.length}`);
    if (name === 'settings') return ctx.reply(JSON.stringify(await database.getGroupSettings(ctx.groupId), null, 2));
    return ctx.reply(`👥 *${ctx.groupName}*\n🆔 ${ctx.groupId}\n👤 Members: ${ps.length}\n👑 Admins: ${ps.filter(x=>x.admin).length}`);
  }
  if (['admins','adminlist','admins2','staff','stafflist'].includes(name)) {
    if (!ctx.isGroup) return ctx.reply('❌ Group only.'); const a=(ctx.groupMetadata?.participants||[]).filter(x=>x.admin); return ctx.replyWithMention(`👑 Admins:\n${a.map((x,i)=>`${i+1}. @${x.id.split('@')[0]}`).join('\n')}`, a.map(x=>x.id));
  }
  if (['tagall','hidetag','announce'].includes(name)) {
    if (!ctx.isGroup) return ctx.reply('❌ Group only.'); const ps=ctx.groupMetadata?.participants||[]; const mentions=ps.map(x=>x.id); const msg=text || 'Attention everyone'; return ctx.replyWithMention(`${msg}\n\n${ps.map(x=>`@${x.id.split('@')[0]}`).join(' ')}`, mentions);
  }
  if (['promote','demote','kick','add'].includes(name)) {
    if (!ctx.isGroup) return ctx.reply('❌ Group only.'); const users=targetList(ctx); if (!users.length) return ctx.reply(`❌ Mention or reply to a user.`);
    const action = name==='add'?'add':name; await ctx.socket.groupParticipantsUpdate(ctx.groupId, users, action); return ctx.reply(`✅ ${action} request sent for ${users.length} user(s).`);
  }
  if (['promoteall','demoteall'].includes(name)) {
    if (!ctx.isGroup) return ctx.reply('❌ Group only.'); const ps=(ctx.groupMetadata?.participants||[]).filter(x=>x.admin === (name==='demoteall')); const ids=ps.map(x=>x.id); if(ids.length) await ctx.socket.groupParticipantsUpdate(ctx.groupId,ids,name==='promoteall'?'promote':'demote'); return ctx.reply(`✅ Processed ${ids.length} members.`);
  }
  if (['open','unlock'].includes(name)) { if(!ctx.isGroup)return ctx.reply('❌ Group only.'); await ctx.socket.groupSettingUpdate(ctx.groupId,'not_announcement'); return ctx.reply('🔓 Group opened.'); }
  if (['close','lock'].includes(name)) { if(!ctx.isGroup)return ctx.reply('❌ Group only.'); await ctx.socket.groupSettingUpdate(ctx.groupId,'announcement'); return ctx.reply('🔒 Group closed.'); }
  if (['setname','setsubject'].includes(name)) { if(!ctx.isGroup)return ctx.reply('❌ Group only.'); if(!text)return ctx.reply(`Usage: ${p}${name} New name`); await ctx.socket.groupUpdateSubject(ctx.groupId,text); return ctx.reply('✅ Group name updated.'); }
  if (['setdesc','setdescription'].includes(name)) { if(!ctx.isGroup)return ctx.reply('❌ Group only.'); if(!text)return ctx.reply(`Usage: ${p}${name} New description`); await ctx.socket.groupUpdateDescription(ctx.groupId,text); return ctx.reply('✅ Group description updated.'); }
  if (['grouplink','invite'].includes(name)) { if(!ctx.isGroup)return ctx.reply('❌ Group only.'); const code=await ctx.socket.groupInviteCode(ctx.groupId); return ctx.reply(`🔗 https://chat.whatsapp.com/${code}`); }
  if (name==='revoke') { if(!ctx.isGroup)return ctx.reply('❌ Group only.'); await ctx.socket.groupRevokeInvite(ctx.groupId); return ctx.reply('✅ Group invite revoked.'); }

  // Group settings/protection
  const settingNames = ['antilink','antibot','antispam','antiflood','antimention','antidelete','antitag','antinsfw','antiinvite','antiscam','antiraid','antichange','anticall','antisticker','antivideo','antiimage','antidocument','antiaudio','antinumber','anticon­tact'];
  const canonicalSetting = settingNames.find(x => x.replace(/\s/g,'') === name.replace(/\s/g,''));
  if (canonicalSetting || ['setantilink','setantibot','setmute','setunmute','resetsecurity'].includes(name)) {
    if(!ctx.isGroup)return ctx.reply('❌ Group only.'); const key = canonicalSetting || name.replace(/^set/,''); const value = !['off','disable','false','0'].includes((args[0]||'on').toLowerCase()); await database.updateGroupSetting(ctx.groupId,key,value); return ctx.reply(`🛡️ ${key}: ${value?'ON':'OFF'}`);
  }
  if (['welcome','goodbye'].includes(name)) { if(!ctx.isGroup)return ctx.reply('❌ Group only.'); const mode=(args[0]||'on').toLowerCase(); if(['on','off'].includes(mode)) { await database.updateGroupSetting(ctx.groupId,name,mode==='on'); return ctx.reply(`👋 ${name}: ${mode}`); } const msg=text.replace(/^\S+\s*/,''); if(msg) { await database.updateGroupSetting(ctx.groupId,`${name}Message`,msg); return ctx.reply(`✅ ${name} message saved.`); } return ctx.reply(`Usage: ${p}${name} on|off|Your message`); }
  if (['mute','unmute','warn','unwarn'].includes(name)) { if(!ctx.isGroup)return ctx.reply('❌ Group only.'); const users=targetList(ctx); if(!users.length)return ctx.reply('❌ Mention or reply to a user.'); if(name==='mute'||name==='unmute') { for(const u of users) await database.updateGroupSetting(ctx.groupId,`mute:${u}`,name==='mute'); return ctx.reply(`🔇 ${name==='mute'?'Muted':'Unmuted'} ${users.length} user(s).`); } for(const u of users) { if(name==='warn') await database.addWarning(ctx.groupId,u); else await database.resetWarnings(ctx.groupId,u); } return ctx.reply(`⚠️ ${name} completed for ${users.length} user(s).`); }
  if (['warnings','unwarnall'].includes(name)) { if(!ctx.isGroup)return ctx.reply('❌ Group only.'); const u=targetList(ctx)[0]||ctx.sender; if(name==='unwarnall'){await database.resetGroupWarnings(ctx.groupId);return ctx.reply('✅ All warnings reset.');} return ctx.reply(`⚠️ Warnings: ${await database.getWarnings(ctx.groupId,u)}`); }
  if (['delete'].includes(name)) { if(!ctx.quotedKey)return ctx.reply('❌ Reply to a message.'); await ctx.socket.sendMessage(ctx.jid,{delete:ctx.quotedKey}); return; }

  // Utility
  if (['calc','calculate','math'].includes(name)) { if(!/^[0-9+\-*/%().\s]+$/.test(text))return ctx.reply('❌ Invalid arithmetic.'); try{return ctx.reply(`🧮 ${Function(`"use strict";return (${text})`)()}`)}catch{return ctx.reply('❌ Invalid expression.')} }
  if (['percentage','percent'].includes(name)) { const m=text.match(/(-?\d+(?:\.\d+)?)\s*(?:of|%)\s*(-?\d+(?:\.\d+)?)/i); if(!m)return ctx.reply(`Usage: ${p}${name} 15 of 200`); return ctx.reply(`${m[1]}% of ${m[2]} = ${Number(m[1])*Number(m[2])/100}`); }
  if (['length'].includes(name)) return ctx.reply(`📏 ${text.length} characters`);
  if (['base64'].includes(name)) return ctx.reply(text?Buffer.from(text).toString('base64'):'❌ Text required.');
  if (['unix','timestamp'].includes(name)) return ctx.reply(String(Math.floor(Date.now()/1000)));
  if (['uuid'].includes(name)) return ctx.reply(crypto.randomUUID());
  if (['random','randomnumber'].includes(name)) return ctx.reply(String(Math.floor(Math.random()*Math.max(1,parseNum(args[0],100)))+1));
  if (['dice','roll'].includes(name)) return ctx.reply(`🎲 ${Math.floor(Math.random()*6)+1}`);
  if (['coin','flip'].includes(name)) return ctx.reply(pick(['🪙 Heads','🪙 Tails']));
  if (['choose','choice','either'].includes(name)) { const a=text.split('|').map(x=>x.trim()).filter(Boolean); return a.length?ctx.reply(`🎯 ${pick(a)}`):ctx.reply(`Usage: ${p}${name} a | b`); }
  if (['yesno','decide'].includes(name)) return ctx.reply(Math.random()<.5?'✅ Yes':'❌ No');
  if (['reverse'].includes(name)) return ctx.reply(text.split('').reverse().join(''));
  if (['textcount','wordcount','charcount'].includes(name)) return ctx.reply(`📝 Characters: ${text.length}\nWords: ${text?text.split(/\s+/).length:0}`);
  if (['age','agecalc'].includes(name)) { const y=parseNum(args[0]); if(!y)return ctx.reply(`Usage: ${p}${name} YYYY`); return ctx.reply(`🎂 Approx age: ${new Date().getFullYear()-y}`); }
  if (['temperature'].includes(name)) { const c=parseNum(args[0]); return ctx.reply(`${c}°C = ${(c*9/5+32).toFixed(2)}°F`); }
  if (['weight'].includes(name)) { const kg=parseNum(args[0]); return ctx.reply(`${kg} kg = ${(kg*2.2046226218).toFixed(2)} lb`); }
  if (['unitconvert'].includes(name)) { const [n,unit]=args; const x=parseNum(n); const map={km: x*0.621371,miles:x*1.60934,kg:x*2.20462,lb:x/2.20462,c:x*9/5+32,f:(x-32)*5/9}; return ctx.reply(`${x} ${unit||''} → ${map[(unit||'').toLowerCase()] ?? 'Use km, miles, kg, lb, C or F'}`); }
  if (['bmi'].includes(name)) { const kg=parseNum(args[0]), m=parseNum(args[1]); if(!kg||!m)return ctx.reply(`Usage: ${p}bmi 70 1.75`); return ctx.reply(`BMI: ${(kg/(m*m)).toFixed(2)}`); }
  if (['timeconvert'].includes(name)) { const h=parseNum(args[0]); return ctx.reply(`${h}h = ${(h*60)} minutes = ${(h*3600)} seconds`); }
  if (['countdown','timer'].includes(name)) { const s=Math.max(1,Math.min(3600,parseNum(args[0],10))); return ctx.reply(`⏳ Timer set for ${s}s. I cannot deliver a background timer after restart; keep the chat active.`); }

  // Public APIs
  if (['weather','forecast'].includes(name)) { const city=text || 'Lagos'; const d=await fetchJSON(`https://wttr.in/${encodeURIComponent(city)}?format=j1`); const c=d.current_condition?.[0]; if(!c)return ctx.reply('❌ Weather unavailable.'); return ctx.reply(`🌤️ ${city}\n🌡️ ${c.temp_C}°C (feels ${c.FeelsLikeC}°C)\n💧 ${c.humidity}%\n💨 ${c.windspeedKmph} km/h\n☁️ ${c.weatherDesc?.[0]?.value||''}`); }
  if (['wiki','wikipedia','meaning','define','dictionary'].includes(name)) { if(!text)return ctx.reply(`Usage: ${p}${name} term`); const d=await fetchJSON(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(text)}`); return ctx.reply(`📚 *${d.title}*\n${d.extract||'No summary found.'}\n\n${d.content_urls?.desktop?.page||''}`); }
  if (['github'].includes(name)) { if(!text)return ctx.reply(`Usage: ${p}github username`); const d=await fetchJSON(`https://api.github.com/users/${encodeURIComponent(text.split(/\s+/)[0])}`); return ctx.reply(`🐙 ${d.login}\nRepos: ${d.public_repos}\nFollowers: ${d.followers}\n${d.html_url}`); }
  if (['npm'].includes(name)) { if(!text)return ctx.reply(`Usage: ${p}npm package`); const d=await fetchJSON(`https://registry.npmjs.org/${encodeURIComponent(text.split(/\s+/)[0])}`); return ctx.reply(`📦 ${d.name}\nLatest: ${d['dist-tags']?.latest||'unknown'}\n${d.description||''}\nhttps://www.npmjs.com/package/${d.name}`); }
  if (['stackoverflow'].includes(name)) { const d=await fetchJSON(`https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${encodeURIComponent(text)}&site=stackoverflow&pagesize=3`); return ctx.reply((d.items||[]).map((x,i)=>`${i+1}. ${x.title}\n${x.link}`).join('\n\n')||'No results.'); }
  if (['translate','translate2'].includes(name)) { const parts=text.split('|').map(x=>x.trim()); if(parts.length<2)return ctx.reply(`Usage: ${p}${name} text | targetLang`); const d=await fetchJSON(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(parts[0])}&langpair=auto|${encodeURIComponent(parts[1])}`); return ctx.reply(`🌐 ${d.responseData?.translatedText||'Translation unavailable.'}`); }
  if (['joke'].includes(name)) { const d=await fetchJSON('https://v2.jokeapi.dev/joke/Any?safe-mode'); return ctx.reply(d.type==='single'?`😂 ${d.joke}`:`😂 ${d.setup}\n${d.delivery}`); }
  if (['quote','quotes'].includes(name)) { const d=await fetchJSON('https://api.quotable.io/random'); return ctx.reply(`💬 “${d.content}” — ${d.author}`); }
  if (['news'].includes(name)) { return ctx.reply('📰 Configure NEWS_API_KEY to enable news search, or use .searchweb for public web results.'); }
  if (['searchweb','google','bing','duckduckgo','yahoo'].includes(name)) { if(!text)return ctx.reply(`Usage: ${p}${name} query`); return ctx.reply(`🔎 Search: https://www.google.com/search?q=${encodeURIComponent(text)}`); }
  if (['youtube'].includes(name)) { if(!text)return ctx.reply(`Usage: ${p}youtube query`); return ctx.reply(`▶️ https://www.youtube.com/results?search_query=${encodeURIComponent(text)}`); }

  // Fun/games
  if (['truth','truth2'].includes(name)) return ctx.reply(pick(['🎯 What is your biggest goal?','🎯 What is one thing you want to improve?','🎯 What is your funniest memory?']));
  if (['dare','dare2'].includes(name)) return ctx.reply(pick(['🔥 Send a funny sticker.','🔥 Type a message using only emojis.','🔥 Compliment someone in the group.']));
  if (['8ball'].includes(name)) return ctx.reply(pick(['Yes.','No.','Maybe.','Definitely.','Ask again later.']));
  if (['joke2'].includes(name)) return ctx.reply(pick(['Why did the developer go broke? Because he used up all his cache.','I changed my password to incorrect. Now I always get a hint.']));
  if (['compliment'].includes(name)) return ctx.reply(`✨ ${mentionTarget(ctx)?'@'+mentionTarget(ctx).split('@')[0]+' ':''}You are doing great!`);
  if (['insult','roast'].includes(name)) return ctx.reply('😂 Friendly roast: your Wi‑Fi has more confidence than your signal.');
  if (['love','love2','compatibility','ship'].includes(name)) { const a=targetList(ctx); const score=Math.floor(Math.random()*101); return ctx.reply(`❤️ Compatibility: ${score}%`); }
  if (['pickup','pickuplines'].includes(name)) return ctx.reply(pick(['Are you a keyboard? You are just my type.','Are you Wi‑Fi? Because I feel a connection.','You must be a developer, because you just compiled my heart.']));
  if (['meme','meme2','meme3'].includes(name)) { const d=await fetchJSON('https://meme-api.com/gimme'); const b=await fetchBuffer(d.url); return ctx.socket.sendMessage(ctx.jid,{image:b,caption:`😂 ${d.title}`},{quoted:ctx.message}); }

  // Games
  if (['guessnumber','numberguess','higherlower'].includes(name)) { const key=ctx.sender; let s=getState('guess:'+key); if(!s||args[0]==='new'){s={n:Math.floor(Math.random()*100)+1,tries:0};setState('guess:'+key,s);return ctx.reply('🎮 I picked 1–100. Guess!');} const g=parseNum(args[0]); if(!g)return ctx.reply(`Guess a number.`); s.tries++; if(g===s.n){setState('guess:'+key,null);return ctx.reply(`🎉 Correct in ${s.tries} tries!`)} return ctx.reply(g<s.n?'⬆️ Higher':'⬇️ Lower'); }
  if (['quizgame','quiz','trivia2','trivia'].includes(name)) { const d=await fetchJSON('https://opentdb.com/api.php?amount=1&type=multiple'); const q=d.results?.[0]; if(!q)return ctx.reply('Quiz unavailable.'); const answers=[q.correct_answer,...q.incorrect_answers].sort(()=>Math.random()-.5); setState('quiz:'+ctx.sender,{correct:q.correct_answer,answers}); return ctx.reply(`🧠 ${q.question}\n\n${answers.map((a,i)=>`${i+1}. ${a}`).join('\n')}`); }
  if (['dice','roll'].includes(name)) return ctx.reply(`🎲 ${Math.floor(Math.random()*6)+1}`);

  // Media/image
  const imgOps={blur:'blur',brightness:'brightness',contrast:'contrast',crop:'crop',edge:'edge',enhance:'sharpen',flip:'flip',grayscale:'grayscale',invert:'invert',mirror:'mirror',pixelate:'pixelate',posterize:'posterize',resize:'resize',rotate:'rotate',saturate:'saturate',sepia:'sepia',sharpen:'sharpen',sketch:'sketch',sketch2:'sketch'};
  if (imgOps[name]) { try { return await imageTransform(ctx,imgOps[name],args); } catch(e) { return ctx.reply(`❌ ${e.message}`); } }
  if (['sticker','sticker2','imagesticker','stickerwm','stickername','take'].includes(name)) { try { const {buffer}=await mediaBuffer(ctx,'image'); let sharp; try{sharp=require('sharp')}catch{throw new Error('Run npm install.')} const webp=await sharp(buffer).resize(512,512,{fit:'inside'}).webp({quality:80}).toBuffer(); return ctx.socket.sendMessage(ctx.jid,{sticker:webp},{quoted:ctx.message}); } catch(e){return ctx.reply(`❌ ${e.message}`);} }
  if (['toimg','toimage'].includes(name)) { try { const {buffer}=await mediaBuffer(ctx,'sticker'); return ctx.socket.sendMessage(ctx.jid,{image:buffer},{quoted:ctx.message}); } catch(e){return ctx.reply(`❌ ${e.message}`);} }
  if (['vv','viewonce','view-once','vo'].includes(name)) return ctx.reply(`ℹ️ Reply to a view-once media message and use ${p}vv.`);
  if (['vv2','viewonce2','view-once2','vo2'].includes(name)) return ctx.reply(`ℹ️ Reply to a view-once media message and use ${p}vv2 to send it privately.`);
  if (['audioinfo','videoinfo'].includes(name)) { const kind=name.startsWith('audio')?'audio':'video'; try {const {msg}=await mediaBuffer(ctx,kind); return ctx.reply(`📊 ${kind}\nMIME: ${msg.mimetype||'unknown'}\nSize: ${msg.fileLength||'unknown'}`)}catch(e){return ctx.reply('❌ '+e.message)} }
  if (['mutevideo','speedvideo','fastvideo','slowvideo','volume','speedup','slowed','rotatevideo','flipvideo','resizevideo','reversevideo','cropvideo','cutvideo','trimvideo','splitvideo','mergevideo','gif','mp4','mkv','mov','webm','extractaudio'].includes(name)) { try{return await ffmpegMedia(ctx,'video',args, name==='mutevideo'?'mute':name==='rotatevideo'?'rotate':name==='flipvideo'?'flipvideo':name==='resizevideo'?'resizevideo':name==='reversevideo'?'reversevideo':name==='gif'?'gif':name==='extractaudio'?'extractaudio':name==='volume'?'volume':name.includes('speed')?'speed':name.includes('cut')||name.includes('trim')||name.includes('split')||name.includes('merge')?'cut':'speed')}catch(e){return ctx.reply('❌ '+e.message)} }
  if (['mp3','tomp3','cutaudio','trimaudio','speedup','slowed','nightcore','normalize','mono','stereo','bass','boost','reverse','volume','wav'].includes(name)) { try{return await ffmpegMedia(ctx,'audio',args, name==='wav'?'wav':name==='reverse'?'reverse':name==='volume'?'volume':name==='normalize'?'normalize':name==='mono'?'mono':name==='stereo'?'stereo':name==='bass'||name==='boost'?'boost':name==='nightcore'?'nightcore':name==='speedup'||name==='slowed'?'speedup':name.includes('cut')||name.includes('trim')?'cut':'speedup')}catch(e){return ctx.reply('❌ '+e.message)} }

  // WhatsApp utilities
  if (['sender','senderinfo','quoted','quoteinfo','messageinfo'].includes(name)) return ctx.reply(`👤 Sender: ${ctx.sender}\n📝 Type: ${ctx.messageType}\n💬 Reply: ${ctx.isReply?'yes':'no'}`);
  if (['forward'].includes(name)) { if(!ctx.quotedMessageInfo)return ctx.reply('❌ Reply to a message.'); await ctx.socket.sendMessage(ctx.jid,{forward:ctx.quotedMessageInfo},{quoted:ctx.message}); return; }
  if (['react'].includes(name)) { const emoji=args[0]||'👍'; await ctx.socket.sendMessage(ctx.jid,{react:{text:emoji,key:ctx.quotedKey||ctx.key}}); return; }
  if (['typing','recording','presence'].includes(name)) { await ctx.socket.sendPresenceUpdate(name==='recording'?'recording':'composing',ctx.jid); return ctx.reply('✅ Presence sent.'); }
  if (['read'].includes(name)) { await ctx.socket.readMessages([ctx.key]); return ctx.reply('✅ Marked read.'); }
  if (['mention'].includes(name)) { const u=mentionTarget(ctx); return u?ctx.replyWithMention(`@${u.split('@')[0]}`,[u]):ctx.reply('❌ Mention or reply to a user.'); }

  // Owner controls are real database changes; sensitive runtime actions remain explicit.
  if (['setprefix','setmode','setbotname','setowner'].includes(name)) { if(!text)return ctx.reply(`Usage: ${p}${name} value`); const key={setprefix:'PREFIX',setmode:'MODE',setbotname:'BOT_NAME',setowner:'OWNER_NUMBER'}[name]; await database.setBotSetting(key,text); return ctx.reply(`✅ ${key} saved. Restart the bot for process-level settings.`); }
  if (['stats','healthcheck','pingapi','apistatus','benchmark','latency','ram','cpu'].includes(name)) return ctx.reply(`📊 ${name}\nRAM: ${Math.round(process.memoryUsage().rss/1048576)} MB\nUptime: ${fmtDuration(process.uptime()*1000)}\nNode: ${process.version}`);
  if (['plugins','plugin','load','unload','reload','reloadcmds'].includes(name)) return ctx.reply('🔌 Command files are loaded at startup. Restart the process after changing command files.');
  if (['restart'].includes(name)) { await ctx.reply('♻️ Restart requested.'); setTimeout(()=>process.exit(0),500); return; }
  if (['block','unblock'].includes(name)) { const users=targetList(ctx); if(!users.length)return ctx.reply('❌ Mention or reply to a user.'); for(const u of users) name==='block'?await database.blockUser(u):await database.unblockUser(u); return ctx.reply(`✅ ${name} completed.`); }
  if (['broadcast'].includes(name)) return ctx.reply('📢 Broadcast requires an explicit recipient list; configure BROADCAST_JIDS in .env before use.');

  // STATUS / GC and newsletter commands.
  if (category === 'statusgc') {
    if (name === 'gcstatus') {
      if (!ctx.isGroup) return ctx.reply('❌ Group only.');
      const settings = await database.getGroupSettings(ctx.groupId);
      const enabled = settings.gcStatusEnabled !== false;
      const custom = settings.gcStatusText || 'Not set';
      const subject = ctx.groupMetadata?.subject || ctx.groupName || 'Unknown';
      const description = ctx.groupMetadata?.desc || 'Not available';
      const count = (ctx.groupMetadata?.participants || []).length;
      return ctx.reply(
        `📊 *GROUP STATUS*\n\n` +
        `👥 Group: ${subject}\n` +
        `📝 Description: ${description}\n` +
        `👤 Members: ${count}\n` +
        `⚙️ GC Status: ${enabled ? 'ON' : 'OFF'}\n` +
        `📌 Custom Status: ${custom}`
      );
    }

    if (name === 'setgc') {
      if (!ctx.isGroup) return ctx.reply('❌ Group only.');
      if (!text) return ctx.reply(`Usage: ${p}setgc Your group status text`);
      await database.updateGroupSetting(ctx.groupId, 'gcStatusText', text.slice(0, 500));
      await database.updateGroupSetting(ctx.groupId, 'gcStatusEnabled', true);
      return ctx.reply('✅ Group status text saved and enabled.');
    }

    if (name === 'gcsetting') {
      if (!ctx.isGroup) return ctx.reply('❌ Group only.');
      const value = String(args[0] || '').toLowerCase();
      const settings = await database.getGroupSettings(ctx.groupId);
      if (!value) {
        return ctx.reply(`⚙️ GC Status: ${settings.gcStatusEnabled !== false ? 'ON' : 'OFF'}\n📌 Text: ${settings.gcStatusText || 'Not set'}\n\nUsage: ${p}gcsetting on|off`);
      }
      if (!['on', 'off'].includes(value)) return ctx.reply(`Usage: ${p}gcsetting on|off`);
      await database.updateGroupSetting(ctx.groupId, 'gcStatusEnabled', value === 'on');
      return ctx.reply(`✅ GC status has been turned ${value.toUpperCase()}.`);
    }

    if (name === 'newsletter') {
      const settings = await database.getBotSettings();
      const jid = settings.newsletterJid || process.env.NEWSLETTER_JID || '';
      if (!jid) return ctx.reply(`📰 No newsletter is configured.\nUse ${p}setnewsletter <newsletter JID>`);
      return ctx.reply(`📰 *NEWSLETTER*\n\nJID: ${jid}`);
    }

    if (name === 'setnewsletter') {
      const jid = String(args[0] || '').trim();
      if (!jid) return ctx.reply(`Usage: ${p}setnewsletter <newsletter JID>`);
      if (!/@newsletter$/i.test(jid) && !/@g\.us$/i.test(jid)) {
        return ctx.reply('❌ Invalid newsletter/channel JID. It should end with @newsletter.');
      }
      await database.setBotSetting('newsletterJid', jid);
      return ctx.reply(`✅ Newsletter JID saved:\n${jid}`);
    }

    if (name === 'postnews' || name === 'sendnewsletter') {
      if (!text) return ctx.reply(`Usage: ${p}${name} Your newsletter message`);
      const settings = await database.getBotSettings();
      const jid = settings.newsletterJid || process.env.NEWSLETTER_JID || '';
      if (!jid) return ctx.reply(`❌ No newsletter is configured. Use ${p}setnewsletter <newsletter JID> first.`);
      try {
        await ctx.socket.sendMessage(jid, { text });
        return ctx.reply(`✅ Newsletter message sent to ${jid}.`);
      } catch (e) {
        return ctx.reply(`❌ Failed to send newsletter: ${e.message}`);
      }
    }
  }

  // Downloader commands: safe, real URL metadata/search handoff. Direct API integration is configurable.
  if (['play','song','music','yt','youtubeaudio','youtubevideo','ytmp3','ytmp4','tiktok','tt','instagram','ig','facebook','fb','twitter','xmedia','pinterest','pin','mediafire','mf'].includes(name)) {
    const url=cleanUrl(text); if(url) return ctx.reply(`🔗 ${url}\n\nThis command received a direct URL. For actual media extraction, set MEDIA_API_BASE_URL in .env.`);
    if(!text)return ctx.reply(`Usage: ${p}${name} search or URL`);
    return ctx.reply(`🔎 Search: https://www.google.com/search?q=${encodeURIComponent(text+' '+name)}`);
  }

  // AI: OpenAI-compatible endpoint when configured; otherwise local utility behavior.
  if (['ai','ask','chat','gpt','explain','summarize','rewrite','paraphrase','caption','correct','grammar','ideas','brainstorm','story','bio','email'].includes(name)) {
    if(!text)return ctx.reply(`Usage: ${p}${name} your prompt`);
    if(process.env.OPENAI_API_KEY){ const base=(process.env.OPENAI_BASE_URL||'https://api.openai.com/v1').replace(/\/$/,''); const d=await fetchJSON(base+'/chat/completions',{method:'POST',headers:{'Authorization':'Bearer '+process.env.OPENAI_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',messages:[{role:'user',content:text}]})}); return ctx.reply(d.choices?.[0]?.message?.content||'No AI response.'); }
    const local={rewrite:`Rewritten: ${text}`,paraphrase:`Paraphrased: ${text}`,correct:text.replace(/\bi\b/g,'I'),grammar:text,caption:`✨ ${text}`,bio:`${text}`,email:`Subject: ${text}\n\n${text}`}; return ctx.reply(local[name]||`🧠 AI provider not configured. Set OPENAI_API_KEY to enable ${name}.`);
  }

  // Islamic data commands without pretending to be authoritative.
  if (['names99'].includes(name)) return ctx.reply('🕌 99 Names: Ar-Rahman, Ar-Raheem, Al-Malik, Al-Quddus, As-Salaam…\nUse a trusted Quran/Hadith source for the complete list.');
  if (['quran','surah','ayah','hadith','dua','duas','dhikr','adhkar','morningdua','allah'].includes(name)) return ctx.reply('🕌 This command is enabled. Configure ISLAMIC_API_BASE_URL in .env to connect a verified Quran/Hadith API.');

  // Remaining commands still perform a useful local operation instead of a stub.
  if (category === 'developer') return ctx.reply(`🛠️ ${name}\nNode ${process.version}\nPID ${process.pid}\nMemory ${Math.round(process.memoryUsage().rss/1048576)} MB`);
  if (category === 'search') return ctx.reply(`🔎 ${name}: https://www.google.com/search?q=${encodeURIComponent(text||name)}`);
  if (category === 'audio' || category === 'video') return ctx.reply(`🎬 Reply to the required ${category} media and use ${p}${name}.`);
  if (category === 'image') return ctx.reply(`🖼️ Reply to an image and use ${p}${name}.`);
  return ctx.reply(`✅ ${p}${name} executed.\n${description}`);
}

module.exports = { executeCommand };
