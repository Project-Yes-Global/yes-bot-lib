import TelegramBot from 'node-telegram-bot-api';
import { extractHashtags } from './hashTags';
import { YesBotConfig } from '../types';

export type TUserAccess = {
  canReply: boolean;
}

export const createUserAccess = (config: YesBotConfig, msg: TelegramBot.Message): TUserAccess => {
  const { chat: { type: chatType }, from } = msg;
  const userId = from?.id?.toString();
  const canReply = chatType === 'private' && !!userId;
  const hashTags = extractHashtags(msg?.text || '');

  return {
    canReply,
    ...(config.callbacks.onUserAccess && config.callbacks.onUserAccess(hashTags, msg)),
  }
}
