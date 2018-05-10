import tmi from 'tmi.js'
import config from '../config'
import { CommandHandler } from './handlers'
import settings from 'electron-settings'
import { ipcMain } from 'electron'

export default class Himmeet {
  constructor (commandHandler) {
    this.commandHandler = commandHandler || new CommandHandler()
    this.timeInMinutes = 0
    this.client = new tmi.client(config.options)
    this.client.connect()
    this.reloadCommands()
    ipcMain.on('commands_updated', function () {
      this.reloadCommands()
    }.bind(this))

    this.client.on('chat', (channel, userstate, message, self) => {
      let command = this.commandHandler.handleMessage(userstate, message)
      if (command) {
        this.client.action(channel, command.text)
      }
    })

    this.client.on('connected', () => {
      this.timeInMinutes = 0
      this.checkAutoRepeatCommands()
    })
  }

  reloadCommands () {
    this.commands = settings.get('commands', [])
    this.commandHandler.setCommands(this.commands)
  }

  checkAutoRepeatCommands () {
    this.runAgain = () => {
      this.timeInMinutes++
      this.enabledAutoRepeatCommands.forEach(command => {
        if ((this.timeInMinutes % command.repeat.minutes) === 0 && this.commandHandler.isCommandAvailableToUse(command)) {
          // TODO: also consider the lines restriciton for repeated commands
          this.client.action('javadar', command.text)
        }
      })
      setTimeout(this.runAgain, 60000)
    }
    this.runAgain()
  }

  get enabledCommands () {
    return this.commands.filter(command => command.enabled)
  }

  get enabledAutoRepeatCommands () {
    return this.commands.filter(command => command.enabled && command.auto_repeat)
  }
}
