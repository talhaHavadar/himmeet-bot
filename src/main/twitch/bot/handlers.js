import config from '../config'

class CommandHandler {
  constructor () {
    this.commands = []
  }

  setCommands (commands) {
    this.commands = commands
  }

  getAvailableCommand (commandName) {
    return this.commands.filter((command) => command.command === commandName && command.enabled)
  }

  handleMessage (sender, message) {
    if (config.options.options.debug) {
      console.log('Handle Message: <Sender:', sender, ', Message:', message)
    }
    this.commandExtractionRegex = /!([^\s]*)\s*((.*\n.*)*)/gi
  }
}

export {
  CommandHandler
}
