import { Plugin } from './plugin'

class Ruffle extends Plugin {
  constructor (params) {
    super('ruffle')
    params = params || {}
    this.name = params.name
    this.description = params.description
    this.keyword = params.keyword || 'ruffle'
    this.winnerCount = params.winnerCount || 1
    this.allowMultipleParticipation = params.allowMultipleParticipation || false
    this.maximumParticipation = params.maximumParticipation || 2 // if maximumParticipation is set to 0 then it will be assumed as infinite
    this.pack = []
    if (this.allowMultipleParticipation) {
      this.pack_map = {}
    }
  }

  addCandidate (name) {
    if (!this.allowMultipleParticipation) {
      if (!this.pack.includes(name)) {
        this.pack.push(name)
      }
    } else {
      if (this.pack_map.hasOwnProperty(name)) {
        if (this.maximumParticipation > this.pack_map[name].count) {
          this.pack_map[name].count += 1
          this.pack.push(name)
        }
      } else {
        this.pack_map[name] = {
          count: 1
        }
        this.pack.push(name)
      }
    }
  }

  selectWinners () {
    let result = []

    for (var i = 0; i < this.winnerCount; i++) {
      let selectedIndex = Math.floor(Math.random() * this.pack.length)
      result.push(this.pack.splice(selectedIndex, 1)[0])
    }

    return result
  }
}

export {
  Ruffle
}
