'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import { Himmeet, PlaceholderHelper, CommandArgumentHelper, config } from './twitch'
import { Ruffle } from './twitch/bot/plugins/ruffle'
import settings from 'electron-settings'
import axios from 'axios'
import querystring from 'querystring'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  createWindow()
  let himmeet = new Himmeet()
  console.log(himmeet)
  settings.set('plugins', [ new Ruffle() ])
  checkAuthorizationOfIntegrations()
  ipcMain.on('render_command_text', (e, command, sender, options) => {
    if (!command) {
      e.returnValue = ''
    } else if (!command.text) {
      e.returnValue = ''
    } else {
      command.placeholders = CommandArgumentHelper.getArguments(command, sender.message.replace(/^!.*?(\s|$)/gmi, ''))
      PlaceholderHelper.renderCommandText(command, sender, options).then(res => {
        e.returnValue = res
      })
    }
  })

  ipcMain.on('get_spotify_authorize_url', (e) => {
    e.returnValue = generateSpotifyAuthorizeInitializationURL()
  })

  ipcMain.on('is_spotify_authorized', (e) => {
    e.returnValue = settings.get('spotify_config', undefined)
  })

  mainWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
    if (!newUrl.startsWith('https://accounts.spotify.com/authorize') && newUrl.startsWith('http://localhost/spotify')) {
      let code = newUrl.split('?')[1].split('code=')[1]
      console.log(settings, code)
      axios.post('https://accounts.spotify.com/api/token', querystring.stringify({ grant_type: 'authorization_code', code: code, redirect_uri: config.spotify.callback_url }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(config.spotify.clientId + ':' + config.spotify.client_secret).toString('base64')
        }
      }).then((response) => {
        console.log('Result of post request:', response.data)
        let spotifyConfigData = {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          scopes: response.data.scope,
          expires: Date.now() + (response.data.expires_in * 1000)
        }
        settings.set('spotify_config', spotifyConfigData)
        mainWindow.loadURL(winURL)
      }).catch((err) => {
        console.log('Error:', err.response)
        mainWindow.loadURL(winURL)
      })
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

function generateSpotifyAuthorizeInitializationURL () {
  return 'https://accounts.spotify.com/authorize?client_id=' + config.spotify.clientId + '&response_type=code&scope=' + config.spotify.scopes + '&redirect_uri=' + config.spotify.callback_url
}

function checkAuthorizationOfIntegrations () {
  let spotifyConfig = settings.get('spotify_config', undefined)
  if (spotifyConfig) {
    axios.post('https://accounts.spotify.com/api/token', querystring.stringify({ grant_type: 'refresh_token', refresh_token: spotifyConfig.refresh_token }), {
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
    }).catch((err) => {
      console.log('Spotify Refresh Token Error:', err.response)
    })
  }
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
