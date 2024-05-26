import { basename, join, parse } from "node:path";
import { createWriteStream, existsSync, mkdir, readFile } from "node:fs";

import { BrowserWindow, app, ipcMain, dialog, IpcMainEvent } from "electron";
import AdmZip from "adm-zip";
import Database from "better-sqlite3";
import axios from "axios";

import { isDev } from "./utils";
import { MediaInfo } from "./types";

let mainWindow: BrowserWindow;

const createWindow = () => {
  const size = 800;

  mainWindow = new BrowserWindow({
    height: size,
    width: size,
    minHeight: size,
    minWidth: size,
    title: "SC - Zoom LS",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(app.getAppPath(), "build", "preload.js"),
    },
  });

  !isDev && mainWindow.setMenu(null);
  isDev && mainWindow.webContents.openDevTools();
  // isDev && mainWindow.maximize();

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
let downList: { title: string; url: string; progress: string }[] = [];
let filePath: string = "";
let directoryPath: string = "";

async function registerListeners() {
  ipcMain.on("chooseFile", (event: IpcMainEvent) => {
    downList = [];
    dialog
      .showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "JW Sign Language", extensions: ["jwlibrary"] }],
      })
      .then((data) => {
        event.sender.send("fileChosen", data);
      });
  });

  ipcMain.on("readDatabase", (event: IpcMainEvent, filePathx: string) => {
    filePath = filePathx;
    readFile(filePath, "utf8", (err: any, _data: any) => {
      if (err) {
        console.error("Erro ao ler o arquivo:", { filePath, filePathx }, err);
        return;
      }
      const parsedPath = parse(filePath);
      directoryPath = join(parsedPath.dir, parsedPath.name);
      createDir(directoryPath);

      const zip = new AdmZip(filePath);

      const userDataEntry = zip.getEntry("userData.db") as AdmZip.IZipEntry;

      zip.extractEntryTo(userDataEntry, directoryPath, false, true);

      const databasePath = join(directoryPath, "userData.db");
      const db = new Database(databasePath); // Usando better-sqlite3 para abrir o banco de dados

      try {
        const rows = db
          .prepare(
            "SELECT 	loc.* FROM Tag t JOIN TagMap tm ON t.TagId = tm.TagId JOIN PlaylistItemLocationMap plilm ON tm.PlaylistItemId = plilm.PlaylistItemId JOIN Location loc ON plilm.LocationId  = loc.LocationId GROUP BY loc.LocationId;"
          )
          .all(); // Executando a consulta e obtendo todas as linhas
        event.sender.send("locationData", rows);
      } catch (err) {
        console.error("Erro ao executar a consulta SQL:", err);
      } finally {
        db.close(); // Fechando o banco de dados
      }
    });
  });

  ipcMain.on("prepareDownList", (_event: IpcMainEvent, itens: MediaInfo[]) => {
    downList = [];
    mainWindow.webContents.send("downList", downList);

    itens.map((item) => {
      console.log({ item });
      downList.push({
        title: item.title || "Sem título",
        url: item.file.url,
        progress: "0",
      });
    });

    mainWindow.webContents.send("downList", downList);
  });

  ipcMain.on("startDownloads", async () => {
    console.log(">>> startDownloads");

    downList.map(async ({ url }, index) => {
      const fileName = basename(url);
      const savePath = join(directoryPath, fileName);

      const writer = createWriteStream(savePath);

      const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
      });

      const totalSize = response.headers["content-length"];
      let downloadedSize = 0;

      response.data.on("data", (chunk: any) => {
        downloadedSize += chunk.length;
        const progress = (downloadedSize / totalSize) * 100;
        downList[index].progress = progress.toFixed(2);
        mainWindow.webContents.send("downList", downList);
      });

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    });
  });
}

async function createDir(directoryPath: string) {
  if (!existsSync(directoryPath)) {
    mkdir(directoryPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Erro ao criar o diretório:", err);
        return;
      }
      console.log("Diretório criado com sucesso:", directoryPath);
    });
  }
}
