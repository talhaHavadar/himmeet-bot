import { Placeholder } from './models'

class PlaceholderHelper {
  static getPlaceholders () {
    return {
      user: new Placeholder('user', function (sender) {
        return sender.display_name
      }),
      uptime : new Placeholder('uptime', function (sender) {
        return 'uptime not implemented yet.'
      })
    }
  }

  static hasPlaceholder (message) {
    let placeholders = PlaceholderHelper.getPlaceholders()
    let placeholderRegex = /\{\{([^\s]*)\}\}/gim
    return false
  }
}


export {
  PlaceholderHelper
}
