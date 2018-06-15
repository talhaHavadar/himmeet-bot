import { Placeholder, CommandArgument } from './models'
import { SpotifyIntegration } from './integrations'
import config from '../config'
import settings from 'electron-settings'
import axios from 'axios'

class PlaceholderHelper {
  static getPlaceholders () {
    return {
      spotify_current_track: new Placeholder('spotify_current_track', function (sender) {
        // TODO: Check the permissions that current user have
        let spotifyAuthorizationInfo = settings.get('spotify_config', undefined)
        if (spotifyAuthorizationInfo) {
          return SpotifyIntegration.getCurrentTrack()
        }
      }),
      user: new Placeholder('user', function (sender) {
        console.log(sender)
        return new Promise(resolve => resolve(sender['display-name']))
      }),
      uptime: new Placeholder('uptime', function (sender, sandbox) {
        if (sandbox) {
          return new Promise(resolve => resolve('1 saat 15 dakikadir'))
        }
        return axios.get('https://api.twitch.tv/kraken/streams/' + config.channel, {
          headers: {
            'Client-ID': config.options.options.clientId
          }
        }).then((res) => {
          if (res.data.stream) {
            let now = Date.now()
            let createdAt = new Date(res.data.stream.created_at)
            let diffInMinutes = (now - createdAt) / 1000 / 60
            let mins = diffInMinutes % 60
            let hours = Math.floor(diffInMinutes / 60)
            return hours + ' saat ' + mins + ' dakikadır'
          } else {
            return '0 dakikadir'
          }
        }).catch(res => console.log('error', res))
      })
    }
  }

  static renderCommandText (command, sender, options) {
    let sandbox = options ? options.sandbox : undefined
    if (!command) {
      return new Promise(resolve => resolve(undefined))
    }
    if (!command.text) {
      return new Promise(resolve => resolve(''))
    }
    let promises = []
    let placeholders = PlaceholderHelper.getPlaceholders()
    let placeholderRegex = /\{\{([^\s]*)\}\}/gim
    let placeholderCandidates = command.text.match(placeholderRegex)
    var message = command.text
    if (placeholderCandidates) {
      for (var i = 0; i < placeholderCandidates.length; i++) {
        let candidate = placeholderCandidates[i]
        let key = candidate.replace('{{', '').replace('}}', '')
        if (key in command.placeholders) {
          promises.push(command.placeholders[key].action(sender, sandbox).then(res => {
            message = message.replace(candidate, res)
          }).catch(res => undefined))
        } else if (key in placeholders) {
          promises.push(placeholders[key].action(sender, sandbox).then(res => {
            message = message.replace(candidate, res)
          }).catch(res => undefined))
        }
      }
    }
    return Promise.all(promises).then(res => message).catch(res => res)
  }

  static hasPlaceholder (message) {
    let placeholders = PlaceholderHelper.getPlaceholders()
    let placeholderRegex = /\{\{([^\s]*)\}\}/gim
    let placeholderCandidates = message.match(placeholderRegex)
    if (placeholderCandidates) {
      for (var i = 0; i < placeholderCandidates.length; i++) {
        let candidate = placeholderCandidates[i].replace('{{', '').replace('}}', '')
        if (candidate in placeholders) {
          return true
        }
      }
    }
    return false
  }
}

class CommandArgumentHelper {
  static getArguments (cmdObj, message) {
    let command = cmdObj.command
    let cmdArguments = command.match(/\{\{([^\s]*)\}\}/gim)
    let result = {}
    if (cmdArguments) {
      let args = message.trim().split(/\s+/)
      for (var i = 0; i < cmdArguments.length; i++) {
        var argument
        var defaultValue
        [argument, defaultValue] = cmdArguments[i].replace('{{', '').replace('}}', '').split(':')
        if (i < args.length) {
          if (args[i] && args[i] !== '') {
            result[argument] = new CommandArgument(argument, args[i])
            continue
          }
        }
        result[argument] = new CommandArgument(argument, defaultValue)
      }
    }
    return result
  }
}

export {
  PlaceholderHelper,
  CommandArgumentHelper
}
