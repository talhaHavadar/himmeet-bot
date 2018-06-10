import config from '../config'

class CommandHandler {
  constructor () {
    this.commands = []
    this.commandExtractionRegex = /^!(.*)?(\s|$)/mi
  }

  setCommands (commands) {
    this.commands = commands
  }

  getAvailableCommand (commandName) {
    return this.commands.filter((command) => command.command === commandName && command.enabled)
  }

  isUserGrantedToUseCommand (user, command) {
    if (user.badges.broadcaster === '1') {
      return true
    }
    let userGroup = user.mod ? 'Moderators' : user.subscriber ? 'Subscribers' : 'Normal Users'
    return command.permissions.filter(permission => permission.name === userGroup).length > 0
  }

  isCommandAvailableToUse (command) {
    if (command.enabled === false) {
      this.log('Command is not enabled ' + command)
      return false
    }

    let commandCooldownInMs = command.cooldown * 1000
    this.log('Command last_used_timestamp: ' + command.last_used_timestamp + ' Date.now: ' + Date.now())

    if (command.last_used_timestamp && (Date.now() - command.last_used_timestamp) < commandCooldownInMs) {
      this.log('Command is not able to use due to cooldown')
      return false
    }
    return true
  }

  log (message) {
    if (config.options.options.debug) {
      console.log(message)
    }
  }

  handleAutoRepeatCommands (timeInMinutes) {
    let results = []
    for (var i = 0; i < this.commands.length; i++) {
      let command = this.commands[i]
      if (command.auto_repeat && (timeInMinutes % command.repeat.minutes) === 0 && this.isCommandAvailableToUse(command)) {
        // TODO: consider lines restricition for auto_repeat commands
        results.push(command)
      }
    }
    return results
  }

  handleMessage (sender, message) {
    this.log('Handle Message: <Sender: ' + sender + ', Message: ' + message)
    let matched = message.match(this.commandExtractionRegex)
    if (matched && matched[1]) {
      let commandName = matched[1]
      for (var i = 0; i < this.commands.length; i++) {
        let command = this.commands[i]
        if (command.command.replace(/\{\{([^\s]*)\}\}/gim, '').trim() === commandName) {
          if (this.isCommandAvailableToUse(command) && this.isUserGrantedToUseCommand(sender, command)) {
            command.last_used_timestamp = Date.now()
            this.log('This command("' + commandName + '") is able to use.')
            return command
          }
        }
      }
    }
  }
}

export {
  CommandHandler
}
