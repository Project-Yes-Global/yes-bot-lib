import { ICommandsManager, TContext, TChatData, ICommand } from '../types';

class CommandStorageManager {
  private storage: Map<string, string> = new Map();

  private key({ chatId }: TChatData) {
    return chatId.toString();
  }

  public add(data: TChatData, cmd: string) {
    const key = this.key(data);
    this.storage.set(key, cmd);
  } 

  public get(data: TChatData): string | undefined {
    const key = this.key(data);
    return this.storage.get(key);;
  }

  public reset(data: TChatData): void {
    const key = this.key(data);
    this.storage.delete(key);
  }
}

const storage = new CommandStorageManager();

export class CommandsManager implements ICommandsManager {
  protected storage: CommandStorageManager = storage;

  command(ctx: TContext, command: ICommand) {
    command.execute(ctx);
  }

  isCommand(cmd: string) {
    return /^\/.*/.test(cmd);
  }

  canCommand(ctx: TContext) {
    return !!this.storage.get(ctx.data);
  }

  getCommand(ctx: TContext) {
    return this.storage.get(ctx.data);
  }

  saveCommand(ctx: TContext, cmd: string) {
    this.storage.add(ctx.data, cmd);
  }

  hasCommand(ctx: TContext, cmd: string) {
    return this.storage.get(ctx.data) === cmd;
  }

  resetCommand(ctx: TContext) {
    this.storage.reset(ctx.data);
  }
}
