import settings from 'electron-settings'

const state = {
  commands: []
}

const mutations = {
  setCommands (state, commands) {
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
    commands.push(command)
    settings.set('commands', commands)
    commit('setCommands', commands)
  },
  refreshCommands ({ commit }) {
    let commands = settings.get('commands', [])
    commit('setCommands', commands)
  },
  removeCommand ({ commit }, command) {
    let commandKey = command.command || command
    commit('removeCommand', commandKey)
  }
}

const getters = {
  getCommands: state => state.commands
}

export default {
  state,
  mutations,
  actions,
  getters
}
