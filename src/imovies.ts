import {
  ImoviesSearchResponse,
  MovieResponse,
  SeasonResponse,
} from "./types.gen";
import axios from "axios";

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

export const getMovie = (id: string) =>
  axios
    .get<MovieResponse>(`https://api.imovies.cc/api/v1/movies/${id}`)
    .then(({ data }) => data.data);

export const getSeason = (id: number, season: number) =>
  axios
    .get<SeasonResponse>(
      `https://api.imovies.cc/api/v1/movies/${id}/season-files/${season}`
    )
    .then(({ data }) => ({
      season,
      episodes: data.data,
    }));
