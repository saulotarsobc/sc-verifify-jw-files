import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { MediaInfo } from "./types";

export const api = {
  chooseFile: () => {
    ipcRenderer.send("chooseFile");
  },

  prepareDownList: (itens: MediaInfo[]) => {
    ipcRenderer.send("prepareDownList", itens);
  },

  startDownloads: () => {
    ipcRenderer.send("startDownloads");
  },

  readDatabase(filePath: string) {
    ipcRenderer.send("readDatabase", filePath);
  },

  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (event: IpcRendererEvent, args: any[]) =>
      callback(event, args)
    );
  },
};

contextBridge.exposeInMainWorld("api", api);
