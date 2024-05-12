import { IpcRendererEvent } from "electron";
import { useCallback, useEffect, useState } from "react";
import { LocationData } from "./@types";
import { processesLocationList } from "./utils";

export default function Home() {
  const [fileChosen, setFileChosen] = useState(false);
  const [filePath, setFilePath] = useState("");

  const [downList, setDownList] = useState<[] | null>(null);

  useEffect(() => {
    window.api.on(
      "fileChosen",
      (_event: IpcRendererEvent, args: Electron.OpenDialogReturnValue) => {
        if (!args.canceled) {
          setFileChosen(true);
          setFilePath(args.filePaths[0]);
        } else {
          setFileChosen(false);
          setFilePath("");
        }
      }
    );

    window.api.on(
      "locationData",
      async (_event: IpcRendererEvent, locations: LocationData[]) => {
        processesLocationList(locations);
      }
    );

    window.api.on("downList", async (_event: IpcRendererEvent, data: any) => {
      setDownList(data);
    });
  }, []);

  useEffect(() => {
    filePath && handleProcesseFile(filePath);
  }, [filePath]);

  const handleProcesseFile = useCallback((filePath: string) => {
    window.api.readDatabase(filePath);
  }, []);

  const startDownloads = useCallback(() => {
    window.api.startDownloads();
  }, []);

  return (
    <main id="home">
      <div>{filePath}</div>
      <button
        onClick={() => {
          window.api.chooseFile();
        }}
      >
        Escolher arquivo
      </button>

      {downList && (
        <table>
          <thead>
            <tr>
              <td>Nome</td>
              <td>Progresso</td>
            </tr>
          </thead>
          <tbody>
            {downList.map((down: any, index) => (
              <tr key={index}>
                <td className="t-title">{down.title}</td>
                <td className="progress">
                  <div className="container-progress">
                    <span className="progress">{down.progress + " %"}</span>
                    <div
                      className="progress"
                      style={{ width: down.progress + "%" }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {fileChosen && downList && (
        <button onClick={startDownloads}>DOWNLOAD</button>
      )}
    </main>
  );
}
