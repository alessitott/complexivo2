import type { Paginated } from "../types/drf";
import type { Reservation } from "../types/reservation";
import { http } from "./http";

export async function listReservationApi(): Promise<Paginated<Reservation> | Reservation[]> {
  const { data } = await http.get<Paginated<Reservation> | Reservation[]>("/api/reservation/");
  return data;
}