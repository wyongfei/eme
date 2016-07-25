'use strict'
const path = require('path')
const {
  BrowserWindow,
  app
} = require('electron')

const isDev = process.env.NODE_ENV === 'development'

class Window {
  constructor() {
    this.wins = 0
  }

  createWindow({
    homepage = `file://${path.join(__dirname, '../index.html')}`
  } = {}) {
    const win = new BrowserWindow({
      name: 'EME',
      width: 800,
      height: 600,
      minWidth: 430,
      minHeight: 250,
      titleBarStyle: 'hidden-inset'
    })

    const id = win.id
    const web = win.webContents

    win.loadURL(homepage)

    win.webContents.on('new-window', (e, url) => {
      e.preventDefault()
      shell.openExternal(url)
    })

    win.on('close', e => {
      if (win.$state.unsaved) {
        e.preventDefault()
        win.webContents.send('close-window')
      }
    })

    win.on('closed', () => {
      this.wins--
    })


    win.on('focus', () => {
      win.webContents.send('win-focus')
    })

    if (isDev) {
      const installExtension = require('electron-devtools-installer')
      installExtension.default(installExtension.VUEJS_DEVTOOLS)
        .then(name => console.log(`Added Extension:  ${name}`))
        .catch(err => console.log('An error occurred: ', err))
    }

    this.wins++
    win.$state = {
      unsaved: 0
    }

    return win
  }
}

module.exports = new Window()
