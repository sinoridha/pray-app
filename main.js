const {app, BrowserWindow, ipcMain, Tray, nativeImage} = require('electron')
const path = require('path')
const remote = require('electron').remote;
const assetsDir = path.join(__dirname, 'assets')

let tray = undefined
let window = undefined

// This method is called once Electron is ready to run our code
// It is effectively the main method of our Electron app
app.on('ready', () => {
  // Setup the menubar with an icon
  let icon = nativeImage.createFromDataURL(base64Icon)
  let iconTry = icon.resize({width:18,height:18});
  let iconApp = icon.resize({width:64,height:64});
  tray = new Tray(iconTry)

  // Add a click handler so that when the user clicks on the menubar icon, it shows
  // our popup window
  tray.on('click', function(event) {
    toggleWindow()

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({mode: 'detach'})
    }
  })

  // Make the popup window for the menubar
  window = new BrowserWindow({
    // width: 600,
    // height: 300,
    width: 180,
    height: 225,
    icon: iconApp.getBitmap,
    show: false,
    frame: false,
    resizable: false,
  })

  // Tell the popup window to load our index.html file
  window.loadURL(`file://${path.join(__dirname, 'index.html')}`)

  // Only close the window on blur if dev tools isn't opened
  window.on('blur', () => {
    if(!window.webContents.isDevToolsOpened()) {
      window.hide()
    }
  })
})

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide()
  } else {
    showWindow()
  }
}

const showWindow = () => {
  const trayPos = tray.getBounds()
  const windowPos = window.getBounds()
  let x, y = 0
  if (process.platform == 'darwin') {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height)
  } else {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height * 10)
  }

  // window.webContents.openDevTools()

  window.setPosition(x, y, false)
  window.show()
  window.focus()
}

ipcMain.on('show-window', () => {
  showWindow()
})

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

if (process.platform == 'darwin') {
  app.dock.hide();
}

let base64Icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOaSURBVFhH7ZhLyBZVHIfHsPICXjEStSxTBHNTCYGF4W0TkhAUGrQQxQu6MEFaaESibbqI2EWhUqxFCYWiEC7UEGkRpdQitShTMUorRS3TvDzPeed83/A67/jlOzML8QcP7/mf98yc35yZ+Z9zJsnR23AI+oaoHk2GP2B6iAo0Ai7BFVhiRU3aC/a5P0QFWg42PAlfW1GDhsNlOAH2/SC0lFdwAFaCjR3RquWdsq/n09+XIVcPgA1Wwbi0vBSqlrf3KHSD7+E7yNV80NRjYOPfYQdUqT7wH6wPUZK8Dnq4O0RN+hj+hjtDlCSb4RzcEaJq9CRo6LkQJclTYPxMiJr0G+xsFIMWgY0fDVE1eg3sY2iIkmQAmEXWhiiju8CGHhA1HqybG6Jq9Dk4MFn9BLsbxU49DpqZFaKG+oF1b4SoGh2GXY1ih7bBr41iQz5j74JmvoBPMlyEb+FeKFtTwNupyWyfP4JefD6D3gcrzqe//8KZtKxBT3IEekOR+sN2eCVExdKcb2/sU/4EE7blC2k5mNSMw9oDzOZ2Mhts6InmpGXny1aaBD9A7GwLxAc/T873GvDZfwc8Zgg4GB+CF+tAbYQwe+jekfSgNTARPMjn4yvwwPuhWdZ9CrY12U6FZeDIm7JWQE9oVpw9TG0e58B0h2NwHDaB/78EycMQ77tpZiAopzs7OgvzrMjoNngBzJO2eQu86qhHYA94TldGEyArTWvO/30hvDD1BGjYeu9qLwiKs8jYEHXqF7BhVj6LcdS+hKLJ3QTsjOTztsCKjFzOeY5XQ9SpF8H6e0KUqqsGbwdzlI+CI+xIXk+DII7mYitSVWLwTbDdwhB1XaYyk7Ij6W1UpRt0ynPk3gvR/5eJ/2dwptBw6QY/A9/MwSG6MTlT2c9MKNWgL4bJ80ZHL8qR86XZCqUaNBH7/7PQrpzOzLulGowzy0PQrkzenuu+9Ldtg9ZXSdsGZV0FfAClGIxvcdkqPc2UrVsG29Utg80aDc4Qq6FjHVegWg3OALcOrlY8j58vRkGRajPoAsBVzj4YCU/DaXC/a9xKtRgcA25u3JraYZRrPuu/gVaL2loMbgD3JHkjFTdG00J0rWoxeBCy33OychOVZyCqFoOn4KNGMVee0z1wnm4ug+57rfTtczEZccPuSjpbl8W3t8ig//t5I+/Yv8A+/8nUidsK64dBh/xC4CeH7EecruLnkVbyK0PeMdfD3WO3JEmSq5tktJgdMACBAAAAAElFTkSuQmCC";