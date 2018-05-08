import tmi from 'tmi.js'
import config from '../config'
import { CommandHandler } from './handlers'
import settings from 'electron-settings'
import { ipcMain } from 'electron'

export default class Himmeet {
  constructor (commandHandler) {
    this.commandHandler = commandHandler || new CommandHandler()
    this.client = new tmi.client(config.options)
    this.client.connect()
    this.reloadCommands()

    ipcMain.on('commands_updated', function () {
      this.reloadCommands()
    }.bind(this))

    this.client.on('chat', (channel, userstate, message, self) => {
      this.commandHandler.handleMessage(userstate, message)
    })
  }

  reloadCommands () {
    this.commands = settings.get('commands', [])
    this.commandHandler.setCommands(this.commands)
  }

  get enabledCommands () {
    return this.commands.filter(command => command.enabled)
  }
}
