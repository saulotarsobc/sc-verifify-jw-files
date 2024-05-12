import { api } from "../../backend/preload";

declare global {
  interface Window {
    api: typeof api;
  }
}

export type LocationData = {
  LocationId?: number | null;
  BookNumber?: number | null;
  ChapterNumber?: number | null;
  DocumentId?: number | null;
  Track?: number | null;
  IssueTagNumber?: number | null;
  KeySymbol?: string | null;
  MepsLanguage?: number | null;
  Type?: number | null;
  Title?: string | null;
};

export type processType = {
  name: string;
  progress: number;
};

export interface MediaInfo {
  title: string;
  file: {
    url: string;
    stream: string;
    modifiedDatetime: string;
    checksum: string | null;
  };
  filesize: number;
  trackImage: {
    url: string;
    modifiedDatetime: string;
    checksum: string | null;
  };
  markers: {
    mepsLanguageSpoken: string;
    mepsLanguageWritten: string;
    bibleBookChapter: number;
    bibleBookNumber: number;
    type: string;
    markers: {
      duration: string;
      verseNumber: number;
      startTime: string;
      label: string;
      endTransitionDuration: string;
    }[];
    hash: string;
    introduction: {
      duration: string;
      startTime: string;
    };
  };
  label: string;
  track: number;
  hasTrack: boolean;
  pub: string;
  docid: number;
  booknum: number;
  mimetype: string;
  edition: string;
  editionDescr: string;
  format: string;
  formatDescr: string;
  specialty: string;
  specialtyDescr: string;
  subtitled: boolean;
  frameWidth: number;
  frameHeight: number;
  frameRate: number;
  duration: number;
  bitRate: number;
}
