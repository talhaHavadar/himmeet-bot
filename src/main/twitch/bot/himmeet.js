import tmi from 'tmi.js'
import config from '../config'
import { CommandHandler } from './handlers'
import { PlaceholderHelper, CommandArgumentHelper } from './helpers'
import settings from 'electron-settings'
import { ipcMain } from 'electron'
import { setTimeout } from 'timers'

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
        console.log('Arguments', CommandArgumentHelper.getArguments(command, message))
        if (PlaceholderHelper.hasPlaceholder(command.text)) {
          PlaceholderHelper.renderCommandText(command, userstate).then(res => {
            this.client.action(channel, res)
          })
        } else {
          this.client.action(channel, command.text)
        }
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
    // TODO: add check for existence of auto_repeat command
    this.timer = setTimeout(function runAgain () {
      this.timeInMinutes++
      let commands = this.commandHandler.handleAutoRepeatCommands(this.timeInMinutes)
      commands.forEach(cmd => {
        this.client.action('javadar', cmd.text)
      })
      setTimeout(runAgain.bind(this), 60000)
    }.bind(this), 60000)
  }

  get enabledCommands () {
    return this.commands.filter(command => command.enabled)
  }
}
