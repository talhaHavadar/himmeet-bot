import { Placeholder } from './models'
import config from '../config'
import axios from 'axios'

class PlaceholderHelper {
  static getPlaceholders () {
    return {
      user: new Placeholder('user', function (sender) {
        return new Promise(resolve => resolve(sender.display_name))
      }),
      uptime: new Placeholder('uptime', function () {
        return axios.get('https://api.twitch.tv/kraken/streams/' + config.channel, {
          headers: {
            'Client-ID': config.options.options.clientId
          }
        }).then((res) => {
          if (res.data.stream) {
            let now = Date.now()
            let createdAt = new Date(res.data.stream.created_at)
            let diffInMinutes = (now - createdAt) / 1000 / 60
            return diffInMinutes
          }
        })
      })
    }
  }

  static renderCommandText (command) {
    let promises = []
    let placeholders = PlaceholderHelper.getPlaceholders()
    let placeholderRegex = /\{\{([^\s]*)\}\}/gim
    let placeholderCandidates = command.text.match(placeholderRegex)
    var message = command.text
    if (placeholderCandidates) {
      for (var i = 0; i < placeholderCandidates.length; i++) {
        let candidate = placeholderCandidates[i]
        let key = candidate.replace('{{', '').replace('}}', '')
        if (key in placeholders) {
          promises.push(placeholders[key].action().then(res => {
            message = message.replace(candidate, res)
          }))
        }
      }
    }
    return Promise.all(promises).then(res => message)
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

export {
  PlaceholderHelper
}
