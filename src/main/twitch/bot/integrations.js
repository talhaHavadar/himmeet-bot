import settings from 'electron-settings'
import axios from 'axios'
import querystring from 'querystring'
import config from '../config'

class SpotifyIntegration {
  static refreshToken () {
    let spotifyConfig = settings.get('spotify_config', undefined)
    if (spotifyConfig) {
      return axios.post('https://accounts.spotify.com/api/token', querystring.stringify({ grant_type: 'refresh_token', refresh_token: spotifyConfig.refresh_token }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(config.spotify.clientId + ':' + config.spotify.client_secret).toString('base64')
        }
      }).then((response) => {
        console.log('Spotify Refresh Token post request:', response.data)
        spotifyConfig.access_token = response.data.access_token
        spotifyConfig.scopes = response.data.scope
        spotifyConfig.expires = Date.now() + (response.data.expires_in * 1000)
        settings.set('spotify_config', spotifyConfig)
        return Promise.resolve({
          success: true,
          message: 'Spotify token is refreshed'
        })
      }).catch((err) => {
        console.log('Spotify Refresh Token Error:', err.response)
        return Promise.reject(err)
      })
    }
    return Promise.reject(new Error('Spotify integration must be done firstly to get a refresh token.'))
  }

  static getCurrentTrack () {
    let spotifyConfig = settings.get('spotify_config', undefined)
    if (spotifyConfig) {
      let expirationTimeInMs = spotifyConfig.expires
      if (expirationTimeInMs === undefined || Date.now() > expirationTimeInMs) {
        // do a refresh call
        SpotifyIntegration.refreshToken().then((res) => {
          if (res.success) {
            return axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
              headers: {
                'Authorization': 'Bearer ' + spotifyConfig.access_token
              }
            }).then((res) => {
              console.log('Currently Playing song', res.data)
              if (res.data.is_playing) {
                let singers = ''
                for (var i = 0; i < res.data.item.artists.length; i++) {
                  let artist = res.data.item.artists[i]
                  singers += artist.name + ' '
                  if (i < res.data.item.artists.length - 1) {
                    singers += '& '
                  }
                }
                return singers + '- ' + res.data.item.name
              } else {
                return 'None'
              }
            }).catch((err) => {
              console.log('An error occured while trying to fetch information about currently playin song.', err.response.data)
              return undefined
            })
          }
        }).catch((err) => {
          console.error(err)
        })
      } else {
        return axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            'Authorization': 'Bearer ' + spotifyConfig.access_token
          }
        }).then((res) => {
          console.log('Currently Playing song', res.data)
          if (res.data.is_playing) {
            let singers = ''
            for (var i = 0; i < res.data.item.artists.length; i++) {
              let artist = res.data.item.artists[i]
              singers += artist.name + ' '
              if (i < res.data.item.artists.length - 1) {
                singers += '& '
              }
            }
            return singers + '- ' + res.data.item.name
          } else {
            return 'None'
          }
        }).catch((err) => {
          console.log('An error occured while trying to fetch information about currently playin song.', err.response.data)
          return undefined
        })
      }
    }
  }
}

export {
  SpotifyIntegration
}
