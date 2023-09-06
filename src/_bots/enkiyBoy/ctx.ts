import TelegramBot from 'node-telegram-bot-api';
import { TContext } from '../../types';
import { PromptManager } from '../../controllers/prompt';
import { CommandsManager } from '../../controllers/cmd';
import { EnkiySystemPrompt } from './controllers/systemPrompt';
import { createUserAccess } from './helpers';

export const createContext = (msg: TelegramBot.Message, botInfo: TelegramBot.User, bot: TelegramBot): TContext => ({
  data: {
    chatId: msg.chat.id,
    fromId: msg.from?.id,
    text: msg.text || ''
  },
  prompts: [],
  userAccess: createUserAccess(msg, botInfo),
  systemPrompt: new EnkiySystemPrompt(),
  prompt: new PromptManager(),
  bot,
  cmd: new CommandsManager()
});

