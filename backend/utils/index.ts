/* eslint-disable eqeqeq */
import { join } from "node:path";

import { app } from "electron";

export const isDev = process.argv.some((str) => str == "--dev");
export const isStart = process.argv.some((str) => str == "--start");

// "file:./database.sqlite"
export const databaseUrl =
  "file:" + join(app.getPath("userData"), "database.sqlite");
