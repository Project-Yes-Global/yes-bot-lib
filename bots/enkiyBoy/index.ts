import TelegramBot from 'node-telegram-bot-api';
import { generate } from '../generate';
import { PromptManager } from '../prompt';
import { createUserAccess } from './userAccess';
import { storageManager } from './storage';

if (!process.env.ENKIY) {
  throw new Error('Telegram API key is needed');
}

const bot = new TelegramBot(process.env.ENKIY, { polling: true });

bot.on('message', async (msg) => {
  if (!msg.text) return;
  const botInfo = await bot.getMe();
  const userAccess = createUserAccess(msg, botInfo);
  
  console.group();
  console.log('message: ', msg.text);
  console.log('userAccess: ', userAccess);
  console.log('userId: ', msg.from?.id);
  
  if (userAccess.canReply || userAccess.canReplyToUser) {
    storageManager.add(msg.chat.id, msg.from?.id, userAccess.message, 'user');
    const messages = storageManager.get(msg.chat.id, msg.from?.id);
    const prompts = new PromptManager(userAccess, messages).getPrompts();
    console.log('prompts: ', prompts);
    const response = await generate(prompts);
    if (!response) return;
    console.log('response: ', response);
    console.groupEnd();
    storageManager.add(msg.chat.id, msg.from?.id, response, 'assistant');
    await bot.sendMessage(msg.chat.id, response, { reply_to_message_id: msg.message_id, parse_mode: 'HTML' });
  }
});