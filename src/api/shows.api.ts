import { http } from "./http";
    
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Show = {
     id: number;
     movie_title: string,
     room: string, 
     price:number, 
     available_seats: number 
    };

export async function listShowsApi() {
  const { data } = await http.get<Paginated<Show>>("/api/shows/");
  return data; // { count, next, previous, results }
}

export async function createShowApi( payload: Omit<Show, "id">) {
  const { data } = await http.post<Show>("/api/shows/", payload);
  return data;
}

export async function updateShowApi( payload: Omit<Show, "id">) {
    const { data } = await http.post<Show>("/api/shows/", payload);
    return data;
  }
export async function deleteShowApi(id: number) {
  await http.delete(`/api/shows/${id}/`);
}