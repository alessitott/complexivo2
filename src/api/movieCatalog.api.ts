import { http } from "./http";

import type { Paginated } from "../types/drf";
import type { MovieCatalog } from "../types/movieCatalog";

export async function listServiceTypesApi(): Promise<Paginated<MovieCatalog> | MovieCatalog[]> {
  const { data } = await http.get<Paginated<MovieCatalog> | MovieCatalog[]>("/api/movie-catalog/");
  return data;
}

export async function createServiceTypeApi(payload: Pick<MovieCatalog, "movie_title"> & Partial<MovieCatalog>): Promise<MovieCatalog> {
  const { data } = await http.post<MovieCatalog>("/api/movie-catalog/", payload);
  return data;
}

export async function deleteServiceTypeApi(id: string): Promise<void> {
  await http.delete(`/api/movie-catalog/${id}/`);
}