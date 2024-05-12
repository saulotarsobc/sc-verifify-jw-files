import { LocationData, MediaInfo } from "../@types";

export async function processesLocationList(locations: LocationData[]) {
  console.log(">> processesLocationList");
  const urls = generateUrls(locations);
  const mediaInfoList: MediaInfo[] = await Promise.all(urls.map(getMediaInfo));
  console.log(mediaInfoList);

  window.api.prepareDownList(mediaInfoList);

  return;
}

function generateUrls(locations: LocationData[]) {
  let locationsUrls: string[] = [];

  locations.forEach((row) => {
    console.log({ row });
    if (row.KeySymbol == "nwt") {
      locationsUrls.push(
        `https://app.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?langwritten=LSB&booknum=${row.BookNumber}&fileformat=MP4&pub=nwt&track=${row.ChapterNumber}`
      );

      return;
    }

    locationsUrls.push(
      `https://app.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?langwritten=LSB&pub=${row.KeySymbol}&track=${row.Track}&fileformat=mp4`
    );
  });

  return locationsUrls;
}

async function getMediaInfo(url: string) {
  console.log(">> getMediaInfo");

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao buscar informações da URL: ${url}`);
    }
    const data = await response.json();
    return data.files["LSB"]["MP4"][3];
  } catch (error) {
    console.error(`Erro ao buscar informações da URL: ${url}`, error);
    return null;
  }
}
