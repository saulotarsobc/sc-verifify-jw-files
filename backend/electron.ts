import { join } from "node:path";

import { BrowserWindow, app, ipcMain } from "electron";

import { isDev } from "./utils";

let mainWindow: BrowserWindow;

const createWindow = () => {
  const size = 900;

  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: size,
    width: size,
    minHeight: size,
    minWidth: size,
    maximizable: true,
    title: "SC - Zoom LS",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(app.getAppPath(), "build", "preload.js"),
    },
  });

  !isDev && mainWindow.setMenu(null);
  isDev && mainWindow.webContents.openDevTools();
  isDev && mainWindow.maximize();

  const url = isDev
    ? "http://localhost:4444/"
    : `file://${join(app.getAppPath(), "build", "index.html")}`;

  mainWindow.loadURL(url);
};

app.whenReady().then(() => {
  createWindow();
  registerListeners();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

/* code */
async function registerListeners() {
  ipcMain.on("message", (event, message) => {
    console.log({ message, event });
  });
}
