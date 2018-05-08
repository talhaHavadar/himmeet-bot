import settings from 'electron-settings'
import { ipcRenderer } from 'electron'

const state = {
  commands: []
}

const mutations = {
  setCommands (state, commands) {
    settings.set('commands', commands)
    ipcRenderer.send('commands_updated')
    state.commands = commands
  },
  removeCommand (state, commandKey) {
    let commands = settings.get('commands', [])
    for (var i = 0; i < commands.length; i++) {
      if (commands[i].command === commandKey) {
        commands.splice(i, 1)
        break
      }
    }
    state.commands = commands
    settings.set('commands', commands)
  }
}

const actions = {
  addCommand ({ commit }, command) {
    let commands = settings.get('commands', [])
    command.id = commands.length + 1
    commands.push(command)
    commit('setCommands', commands)
  },
  refreshCommands ({ commit }) {
    let commands = settings.get('commands', [])
    commit('setCommands', commands)
  },
  removeCommand ({ commit }, command) {
    let commandKey = command.command || command
    commit('removeCommand', commandKey)
  },
  editCommand ({ commit }, command) {
    let commands = settings.get('commands', [])
    if (commands.length === 0) {
      command.id = 1
      commands.push(command)
    } else {
      for (var i = 0; i < commands.length; i++) {
        if (commands[i].id === command.id) {
          commands[i] = command
          break
        }
      }
    }
    settings.set('commands', commands)
    commit('setCommands', commands)
  }
}

const getters = {
  getCommands: state => state.commands,
  getCommandByName: state => name => state.commands.filter(command => command.command === name).slice()[0]
}

export default {
  state,
  mutations,
  actions,
  getters
}
