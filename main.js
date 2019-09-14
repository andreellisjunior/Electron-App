const electron = require('electron')
const url = require('url')
const path = require('path')

const {app, BrowserWindow, Menu, ipcMain} = electron

// Set ENV
process.env.NODE_ENV = "production"

let mainWindow;
let addWindow;

// First thing listen for app to be ready
app.on('ready', () => {
  // Create new window
  mainWindow = new BrowserWindow({
    webPreferences: 
    {
      nodeIntegration: true
    }
  })
  // Load html file in the window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Quit app when closed
  mainWindow.on('closed', () => {
    app.quit()
  })

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

  // Insert menu
  Menu.setApplicationMenu(mainMenu)



})

// Handles create add window
const createAddWindow = () => {
  // Create new window
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add Shopping List Item',
    webPreferences: 
    {
      nodeIntegration: true
    }
  })
  // Load html file in the window
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Garbage collection handle
  addWindow.on('close', () => {
    addWindow = null;
  })
}

// Catch item:add
ipcMain.on('item:add', (e, item) => {
  mainWindow.webContents.send('item:add', item)
  addWindow.close()
})

// Create menu template
const mainMenuTemplate = [
  {
  label: 'File',
  submenu: [
    {
      label: 'Add Item',
      click() {
        createAddWindow()
      }
    },
    {
      label: 'Clear Items'
    },
    {
      label: 'Quit',
      // This adds the keyboard shortcut to quit the application. 
      accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
      // This let's you exit the program
      click(){
        app.quit()
      }
    }
  ]
}]

// If mac, add empty object to menu
if(process.platform == 'darmin') {
  mainMenuTemplate.unshift({});
}

// Add developer tools item if not in production
if(process.env.NODE_ENV != 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        // This adds the keyboard shortcut to open the DevTools. 
       accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, FocusedWindow) {
          FocusedWindow.toggleDevTools()
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}