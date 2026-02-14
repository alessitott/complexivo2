import { http } from "./http";
    
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Reservation = {
  id: number;
  show_id: number;
  showid_nombre?: string;
  customer_name: string;
  seats: number;
  status: string;
  created_at?: string;
};


export async function listReservationAdminApi() {
  const { data } = await http.get<Paginated<Reservation>>("/api/reservation/");
  return data;
}

export async function createReservationApi(payload: Omit<Reservation, "id">) {
  const { data } = await http.post<Reservation>("/api/reservation/", payload);
  return data;
}

export async function updateReservationApi(id: number, payload: Partial<Reservation>) {
  const { data } = await http.put<Reservation>(`/api/reservation/${id}/`, payload);
  return data;
}

export async function deleteReservationApi(id: number) {
  await http.delete(`/api/reservation/${id}/`);
}