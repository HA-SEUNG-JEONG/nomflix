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
  overview: string;
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

export function getMovies() {
  return fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
