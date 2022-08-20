import axios from "axios";

export interface ImoviesSearchResponse {
  data: ImoviesSearchResponseDatum[];
  meta: Meta;
}

export interface ImoviesSearchResponseDatum {
  id: number;
  type: Type;
  adjaraId: number | null;
  originalName: string;
  primaryName: string;
  secondaryName: string;
  tertiaryName: string;
  primaryDescription: string;
  secondaryDescription: string;
  tertiaryDescription: string;
  poster: string;
  isTvShow: boolean;
  isAdult: boolean;
  isFree: boolean;
  year: number;
  weight: number;
  rating: Rating;
  highlights: Highlight[];
  _akaNames: AkaName[];
  _score: number;
  _explain: any[];
  posters?: Ers;
  covers?: Ers;
  languages: Languages;
  trailer?: Trailer | null;
}

export interface AkaName {
  type: string;
  name: string;
}

export interface Ers {
  data: { [key: string]: string };
}

export interface Highlight {
  field: Field;
  value: string;
}

export enum Field {
  OriginalName = "originalName",
  PrimaryName = "primaryName",
  SecondaryName = "secondaryName",
  TertiaryName = "tertiaryName",
}

export interface Languages {
  data: LanguagesDatum[];
}

export interface LanguagesDatum {
  code: Code;
  primaryName: PrimaryName;
  primaryNameTurned: PrimaryNameTurned;
  tertiaryName: TertiaryName;
  secondaryName: SecondaryName;
}

export enum Code {
  Eng = "ENG",
  Fre = "FRE",
  Geo = "GEO",
  Jpn = "JPN",
  Rus = "RUS",
}

export enum PrimaryName {
  TheᲘაპონური = "იაპონური",
  TheᲘნგლისური = "ინგლისური",
  TheᲠუსული = "რუსული",
  TheᲤრანგული = "ფრანგული",
  TheᲥართული = "ქართული",
}

export enum PrimaryNameTurned {
  TheᲘაპონურად = "იაპონურად",
  TheᲘნგლისურად = "ინგლისურად",
  TheᲠუსულად = "რუსულად",
  TheᲤრანგულად = "ფრანგულად",
  TheᲥართულად = "ქართულად",
}

export enum SecondaryName {
  English = "English",
  French = "French",
  Georgian = "Georgian",
  Japanese = "Japanese",
  Russian = "Russian",
}

export enum TertiaryName {
  Английский = "Английский",
  Грузинский = "Грузинский",
  Русский = "Русский",
  Французский = "Французский",
  Японский = "Японский",
}

export interface Rating {
  imdb: Imdb;
  imovies: Imdb;
}

export interface Imdb {
  score: number;
  voters: number;
}

export interface Trailer {
  data: Data;
}

export interface Data {
  id: number;
  name: string;
  fileUrl: string;
  language: Code;
}

export enum Type {
  Movie = "movie",
  Person = "person",
}

export interface Meta {
  pagination: Pagination;
}

export interface Pagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  links: Links;
}

export interface Links {
  next: string;
}

export const search = (query: string) =>
  axios
    .get<ImoviesSearchResponse>(`https://api.imovies.cc/api/v1/multi-search`, {
      params: {
        keywords: query,
        ["filters[type]"]: "movie",
        page: 1,
        per_page: 10,
      },
      headers: {
        origin: "https://www.imovies.cc",
      },
    })
    .then(({ data }) => data.data);
