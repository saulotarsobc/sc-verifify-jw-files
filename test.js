const axios = require("axios");
const fs = require("fs");
const path = require("path");

const url =
  "https://download-a.akamaihd.net/files/media_publication/2e/nwt_19_Ps_LSB_034_r720P.mp4";
const fileName = path.basename(url);
const savePath = path.join(__dirname, fileName);

const downloadVideo = async () => {
  const writer = fs.createWriteStream(savePath);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  const totalSize = response.headers["content-length"];
  let downloadedSize = 0;

  response.data.on("data", (chunk) => {
    downloadedSize += chunk.length;
    const progress = (downloadedSize / totalSize) * 100;
    console.log(`Download progress: ${progress.toFixed(2)}%`);
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

downloadVideo()
  .then(() => console.log("Download completed"))
  .catch((error) => console.error("Download failed:", error));
