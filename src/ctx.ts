import TelegramBot from 'node-telegram-bot-api';
import { CommandsManager } from './controllers/cmd';
import { SystemPromptManager } from './controllers/systemPrompt';
import { PromptManager } from './controllers/prompt';
import { BotController } from './controllers/botController';
import { createUserAccess } from './helpers';
import { TContext, YesBotConfig } from './types';

export const createContext = (bot: TelegramBot, config: YesBotConfig, msg: TelegramBot.Message): TContext => ({
  data: {
    chatId: msg.chat.id,
    text: msg.text || '',
    messageId: msg.message_id,
    msg
  },
  prompts: [],
  userAccess: createUserAccess(msg),
  cmd: new CommandsManager(),
  systemPrompt: new SystemPromptManager(config.defaultPrompt),
  prompt: new PromptManager(config.keys.openai, config.openai),
  bot: new BotController(bot),
});

