import type { Paginated } from "../types/drf";
import type { ReservationEvent } from "../types/reservationEvent";
import { http } from "./http";

export type ReservationEventCreatePayload = {
  reservation_id: number;
  event_type?: string;
  source?: string;
  note?: string;
  created_at?: string;
};

export async function listReservationEventApi(): Promise<Paginated<ReservationEvent> | ReservationEvent[]> {
  const { data } = await http.get<Paginated<ReservationEvent> | ReservationEvent[]>("/api/reservation-event/");
  return data;
}

export async function createReservationEventApi(payload: ReservationEventCreatePayload): Promise<ReservationEvent> {
  const { data } = await http.post<ReservationEvent>("/api/reservation-event/", payload);
  return data;
}

export async function deleteReservationEventApi(id: string): Promise<void> {
  await http.delete(`/api/reservation-event/${id}/`);
}