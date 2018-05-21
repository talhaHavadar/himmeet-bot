class Placeholder {
  constructor (key, action) {
    this.key = key
    this.action = action
  }
}

class CommandArgument extends Placeholder {
  constructor (name, value) {
    super(name, (sender, options) => new Promise((resolve) => resolve(value)))
  }
}

export {
  Placeholder,
  CommandArgument
}
