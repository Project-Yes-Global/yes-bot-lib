import TelegramBot from 'node-telegram-bot-api';

export type TUserAccess = {
  canReply: boolean;
}

export const createUserAccess = (msg: TelegramBot.Message): TUserAccess => {
  const { chat: { type: chatType }, from } = msg;
  const userId = from?.id?.toString();
  const canReply = chatType === 'private' && !!userId;

  return {
    canReply
  }
}
