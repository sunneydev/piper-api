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

export interface Movie {
  id: number;
  adjaraId: number;
  primaryName: string;
  secondaryName: string;
  tertiaryName: string;
  originalName: string;
  year: number;
  releaseDate: string;
  imdbUrl: string;
  isTvShow: boolean;
  budget: string;
  income: string;
  duration: number;
  adult: boolean;
  parentalControlRate: string;
  watchCount: number;
  canBePlayed: boolean;
  regionAllowed: boolean;
  packAllowed: boolean;
  isFree: boolean;
  cover: Cover;
  poster: string;
  rating: Rating;
  hasSubtitles: boolean;
  languages: Languages;
  posters: Ers;
  covers: Ers;
  plot: Plot;
  plots: Plots;
  genres: Countries;
  trailers: AkaNames;
  tvcom: Tvcom;
  countries: Countries;
  studios: AkaNames;
  seasons: Seasons;
  vast: Vast;
  userWatch: UserWatch;
  userFollows: User;
  userWantsToWatch: User;
  userSubscribed: User;
  userMovieLists: AkaNames;
  userRating: UserRating;
  directors: Directors;
  akaNames: AkaNames;
  oscarNominations: AkaNames;
}

export interface AkaNames {
  data: AkaNamesDatum[];
}

export interface AkaNamesDatum {
  type: string;
  name: string;
}

export interface Countries {
  data: CountriesDatum[];
}

export interface CountriesDatum {
  id: number;
  primaryName: string;
  secondaryName: string;
  tertiaryName: string;
  backgroundImage?: string;
}

export interface Cover {
  small: string;
  large: string;
}

export interface Ers {
  data: { [key: string]: string };
}

export interface Directors {
  data: DirectorsDatum[];
}

export interface DirectorsDatum {
  id: number;
  originalName: string;
  primaryName: string;
  secondaryName: string;
  tertiaryName: string;
  poster: string;
  birthDate: string;
  birthPlace: string;
  deathDate: string;
  deathPlace: string;
  height: number;
  slogan: string;
  zodiacSign: ZodiacSign;
}

export enum ZodiacSign {
  Aquarius = "Aquarius",
  Empty = "",
  Taurus = "Taurus",
}

export interface Languages {
  data: LanguagesDatum[];
}

export interface Plot {
  data: DAT;
}

export interface DAT {
  description: string;
  language: string;
}

export interface Plots {
  data: DAT[];
}

export interface Rating {
  imovies: Imdb;
  imdb: Imdb;
  rotten: Imdb;
  metacritic: Imdb;
}

export interface Seasons {
  data: SeasonsDatum[];
}

export interface SeasonsDatum {
  movieId: number;
  number: number;
  name: string;
  episodesCount: number;
  upcomingEpisodesCount: number;
}

export interface Tvcom {
  data: TvcomData;
}

export interface TvcomData {
  url: string;
}

export interface User {
  data: UserFollowsData;
}

export interface UserFollowsData {
  status: boolean;
}

export interface UserRating {
  data: UserRatingData;
}

export interface UserRatingData {
  status: boolean;
  rate: number;
}

export interface UserWatch {
  data: UserWatchData;
}

export interface UserWatchData {
  season: null;
  episode: null;
  language: string;
  quality: string;
  progress: number;
  duration: number;
  visible: boolean;
  updateDate: string;
  watched: boolean;
}

export interface Vast {
  data: VastData;
}

export interface VastData {
  url: string;
  pause_url: null;
}

export interface MovieResponse {
  data: Movie;
}

export interface SeasonResponse {
  data: Episode[];
}

export interface Episode {
  episode: number;
  episodes_include: string;
  title: string;
  description: string;
  rating: number;
  upcoming: boolean;
  file_will_be_added_soon: boolean;
  air_date: null;
  poster: string;
  covers: Covers;
  files: DatumFile[];
}

export interface Covers {
  "1920": string;
  "1050": string;
  "510": string;
  "367": string;
  "145": string;
  imageHeight: number;
  position: Position;
  positionPercentage: string;
  blurhash: string;
}

export enum Position {
  Center = "center",
}

export interface DatumFile {
  lang: FileLang;
  files: FileFile[];
  subtitles: Subtitle[];
}

export interface FileFile {
  id: number;
  quality: Quality;
  src: string;
  duration: number;
  thumbnails: Thumbnail[];
}

export enum Quality {
  High = "HIGH",
  Medium = "MEDIUM",
}

export interface Thumbnail {
  id: number;
  url: string;
  start_time: number;
  end_time: number;
  duration: number;
  interval: number;
  width: number;
  height: number;
  columns: number;
}

export enum FileLang {
  Eng = "ENG",
  Geo = "GEO",
  Rus = "RUS",
}

export interface Subtitle {
  lang: SubtitleLang;
  url: string;
}

export enum SubtitleLang {
  Eng = "eng",
  Rus = "rus",
}
