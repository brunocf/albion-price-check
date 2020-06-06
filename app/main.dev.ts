/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, globalShortcut, clipboard, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 300,
    height: 600,
    webPreferences:
      process.env.NODE_ENV === 'development' || process.env.E2E_BUILD === 'true'
        ? {
            nodeIntegration: true
          }
        : {
            preload: path.join(__dirname, 'dist/renderer.prod.js')
          }
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);
  //mainWindow.setAlwaysOnTop(true);

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  Menu.setApplicationMenu(null);
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  globalShortcut.unregister('CommandOrControl+Shift+C')

  // Unregister all shortcuts.
  globalShortcut.unregisterAll()

  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

let lastClipboard = '';
app.on('ready', async () => {
  createWindow();
  globalShortcut.register('CommandOrControl+Shift+C', async () => {
    const text = clipboard.readText();
    console.log(text);
    mainWindow?.webContents.send('_clipboard_event_', text);
    mainWindow?.show();
  });
  setInterval(() => {
    try {
      const value = clipboard.readText();
      if (value === lastClipboard) return;
      if (value) {
        let start = -1;
        for(let i=0; i<value.length; i++) {
          const code = value.charCodeAt(i);
          if (code === 65535) {
            if (start === -1) {
              start = i;
            } else {
              mainWindow?.webContents.send('_clipboard_event_', value);
              mainWindow?.show();
              console.log(value);
              lastClipboard = value;
              return;
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, 250);
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
