import { api } from "../../backend/preload";

declare global {
  interface Window {
    ipcRenderer: typeof api;
  }
}
