import TelegramBot from 'node-telegram-bot-api';

export type TRole = 'assistant' | 'user' | 'system';

export type TMessage = {
  role: TRole;
  content: string;
}

export type TChatData = {
  chatId: number;
  text?: string;
  fromId?: number;
  messageId?: number;
  msg?: TelegramBot.Message;
}

export type TContext = {
  data: TChatData;
  userAccess: IUserAccess;
  systemPrompt: ISystemPromptManager;
  prompt: IPromptManager;
  cmd: ICommandsManager;
  prompts: TMessage[];
  bot: IBotController;
}

export interface IUserAccess {
  admin?: boolean;
  channel?: boolean;
  canReply: boolean;
  canReplyToUser?: boolean;
}

export interface IBotController {
  bot: TelegramBot;
  sendMessage(msg: TelegramBot.Message, response: string): Promise<void>;
  isCommand(ctx: TContext): boolean;
}

export interface IPromptManager {
  generate(ctx: TContext): Promise<string | undefined>;
  getMessages(ctx: TContext): TMessage[];
  saveMessage(ctx: TContext, role: TRole, text: string): void;
  resetMessags(ctx: TContext): void;
  createPrompts(ctx: TContext, text?: string): TContext;
}

export interface ISystemPromptManager {
  generate(ctx: TContext): string;
  getPrompt(ctx: TContext): string;
  savePrompt(ctx: TContext, prompt: string): void;
  resetPrompt(ctx: TContext): void;
}

export interface ICommandsManager {
  getCommand(ctx: TContext): string | undefined;
  saveCommand(ctx: TContext, cmd: string): void;
  hasCommand(ctx: TContext, cmd: string): boolean;
  resetCommand(ctx: TContext): void;
  canCommand(ctx: TContext): boolean;
  isCommand(cmd: string): boolean;
  command(ctx: TContext, cmd: ICommand): void;
}

export interface ICommand {
  name: string;
  id: string;
  execute(ctx: TContext, cmd?: string): void;
}

export type YesBotConfig = {
  commands: ICommand[];
  defaultPrompt: string;
  callbacks: {
    onMessage?: (ctx: TContext) => void;
  }
}