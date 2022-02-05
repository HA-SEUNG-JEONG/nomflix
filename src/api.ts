const API_KEY = "da6e56e4991abb3ac7b818c0fbc7b424";
const BASE_URL = "https://api.themoviedb.org/3";

/**
 * Interface to the `results`
 */
interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  name: string;
  overview: string;
  vote_average: string;
}

/**
 * Result of `getMovies`
 */
export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

interface IGenre {
  id: number;
  name: string;
}

export interface IGetMovieDetailResult {
  backdrop_path: string;
  genres: IGenre[];
  homepage: string;
  id: number;
  imdb_id: string;
  overview: string;
  poster_path: string;
  release_date: Date;
  runtime: number;
  status: string;
  vote_average: number;
  vote_count: number;
  tagline: string;
  name?: string;
  title?: string;
}

interface ISeason {
  air_date: Date;
  episode_count: number;
  id: number;
  name: string;
}

export interface IGetTvDetailResult {
  backdrop_path: string;
  episode_run_time: number[];
  first_air_date: Date;
  genres: IGenre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: Date;
  name: string;
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  overview: string;
  poster_path: string;
  seasons: ISeason[];
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
}

export async function getMovies() {
  // return fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`).then(
  //   (response) => response.json()
  // );
  return await (
    await fetch(
      `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=ko-KR`
    )
  ).json();
}

export const getTopRatedMovies = () => {
  return fetch(
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=ko-KR&page=1&region=KR`
  ).then((response) => response.json());
};

export const getPopularMovies = () => {
  return fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1&region=KR`
  ).then((response) => response.json());
};

export const getUpcomingMovies = () => {
  return fetch(`
  ${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=ko-KR&page=1&region=KR`).then(
    (response) => response.json()
  );
};

export const getMovieDetail = (movieId: string) => {
  return fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ko-KR&append_to_response=KR`
  ).then((response) => response.json());
};

export const getPopularTv = () => {
  return fetch(
    `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=ko-KR&page=1&region=KR`
  ).then((response) => response.json());
};

export const getTopTv = () => {
  return fetch(
    `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=ko-KR&page=1&region=KR`
  ).then((response) => response.json());
};

export const getTvDetail = (tvId: string) => {
  return fetch(
    `${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&language=ko-KR&append_to_response=KR`
  ).then((response) => response.json());
};

export const DEFAULT_IMG =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80";

export const searchMovie = (query: string) => {
  return fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&language=ko-KR&query=${query}&page=1&region=KR`
  ).then((response) => response.json());
};

export const searchTv = (query: string) => {
  return fetch(
    `${BASE_URL}/search/tv?api_key=${API_KEY}&language=ko-KR&query=${query}&page=1&region=KR`
  ).then((response) => response.json());
};
