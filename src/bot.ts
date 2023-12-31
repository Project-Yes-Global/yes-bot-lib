
import TelegramBot from 'node-telegram-bot-api';
import { createContext } from './ctx';
import { YesBotConfig } from './types'

export class YesBot {
  config: YesBotConfig;
  bot: TelegramBot;

  constructor(config: YesBotConfig) {
    this.bot = new TelegramBot(config.keys.telegram, { polling: true });
    this.config = config;
  }

  public start() {
    this.init();
    this.subscribe();
  }

  private init() {
    const commands = this.config.commands?.map(c => ({ command: c.id, description: c.name }));
    !!commands?.length && this.bot.setMyCommands(commands);
  }

  private subscribe() {
    const { bot, config } = this;
    bot.on('message', this.onMessage.bind(this));
    bot.on('callback_query', this.onCallbackQuery.bind(this));

    if (config.commands?.length > 0) {
      config.commands.forEach(c => {
        bot.onText(new RegExp(`\/${c.id}`), (msg) => {
          const ctx = createContext(bot, config, msg);
          ctx.cmd.command(ctx, c);
        });
      });
    }
  }

  private async onMessage(msg: TelegramBot.Message) {
    if (!msg.text) return;

    let ctx = createContext(this.bot, this.config, msg);

    if (this.config.callbacks.onMessage) {
      this.config.callbacks.onMessage(ctx);
      return;
    }
      
    if (ctx.userAccess.canReply && !ctx.bot.isCommand(ctx)) {
      ctx = ctx.prompt.createPrompts(ctx, msg.text);
      const response = await ctx.prompt.generate(ctx);
      if (!response) return;
      await ctx.bot.sendMessage(msg, response);
    } else if (ctx.cmd.canCommand(ctx)) {
      const command = this.config.commands?.find(c => c.id === msg.text);
      command && ctx.cmd.command(ctx, command);
    }
  }

  private async onCallbackQuery(query: TelegramBot.CallbackQuery) {
    if (!query.message || !query.data) return;
    const ctx = createContext(this.bot, this.config, query.message);

    if (this.config.callbacks.onCallbackQuery) {
      this.config.callbacks.onCallbackQuery(ctx, query);
      return;
    }
    
    const command = this.config.commands?.find(c => c.id === query.data);
    command && ctx.cmd.command(ctx,command);
  }
}
