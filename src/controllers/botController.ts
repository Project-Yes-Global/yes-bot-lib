import TelegramBot from 'node-telegram-bot-api';
import { IBotController, TContext } from '../types';

export class BotController implements IBotController{
  public telegram: TelegramBot;

  constructor(bot: TelegramBot) {
    this.telegram = bot;
  } 

  async sendMessage(msg: TelegramBot.Message, response: string) {
    await this.telegram.sendMessage(
      msg.chat.id,
      response,
      { reply_to_message_id: msg.message_id, parse_mode: 'HTML' }
    );
  }

  isCommand(ctx: TContext) {
    return ctx.cmd.canCommand(ctx) || ctx.cmd.isCommand(ctx.data.msg.text)
  }
}