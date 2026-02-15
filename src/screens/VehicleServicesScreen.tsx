import { Picker } from "@react-native-picker/picker";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { listReservationApi } from "../api/reservation.api";
import { createReservationEventApi, deleteReservationEventApi, listReservationEventApi } from "../api/reservationEvent.api";

import { toArray } from "../types/drf";
import type { Reservation } from "../types/reservation";
import type { ReservationEvent } from "../types/reservationEvent";


function parseOptionalNumber(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return { value: undefined };
  
}

export default function ReservationEventScreen() {
  const [reservationEvent, setReservationEvent] = useState<ReservationEvent[]>([]);
  const [reservation, setReservation] = useState<Reservation[]>([]);
  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState<string>("");
  const [eventType, setEventType] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const [note, setNote] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const reservationById = useMemo(() => {
    const map = new Map<number, Reservation>();
    reservation.forEach((v) => map.set(v.id, v));
    return map;
  }, [reservation]);


  const loadAll = async (): Promise<void> => {
    try {
      setErrorMessage("");

      const [reservationEventData, reservationData] = await Promise.all([
        listReservationEventApi(),
        listReservationApi(),
      ]);

      const reservationEventList = toArray(reservationEventData);
      const reservationList = toArray(reservationData);
      

      setReservationEvent(reservationEventList);
      setReservation(reservationList);

      if (selectedReservationId === null && reservationList.length) setSelectedReservationId(reservationList[0].id);
    } catch {
      setErrorMessage("No se pudo cargar info. ¿Token? ¿baseURL? ¿backend encendido?");
    }
  };

  useEffect(() => { loadAll(); }, []);

  const createService = async (): Promise<void> => {
    try {
      setErrorMessage("");

      if (selectedReservationId === null) return setErrorMessage("Seleccione una reservas");

      const trimmedNotes = note.trim() ? note.trim() : undefined;
     

      // NO enviar fecha, backend la toma actual
      const created = await createReservationEventApi({
        reservation_id: selectedReservationId,
        event_type: eventType,
        source: source,
        note: trimmedNotes,
      });

      setReservationEvent((prev) => [created, ...prev]);
      setNote("");
      setEventType("");
      setSource("");
    } catch {
      setErrorMessage("No se pudo crear vehicle service");
    }
  };

  const removeService = async (id: string): Promise<void> => {
    try {
      setErrorMessage("");
      await deleteReservationEventApi(id);
      setReservationEvent((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setErrorMessage("No se pudo eliminar vehicle service");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estados de las reservas</Text>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Text style={styles.label}>Nombre del show</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedReservationId ?? ""}
          onValueChange={(value) => setSelectedReservationId(Number(value))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          {reservation.map((v) => (
            <Picker.Item key={v.id} label={v.showid_nombre ?? v.customer_name} value={v.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Estado evento</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={eventType}
          onValueChange={(value) => setEventType(String(value))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
            <Picker.Item label="creado" value="creado" />
            <Picker.Item label="cancelado" value="cancelado" />
            <Picker.Item label="confirmado" value="confirmado" />
            <Picker.Item label="ingreso" value="ingreso" />
         
        </Picker>
      </View>

      <Text style={styles.label}>Dispositvo donde se realizo la reserva</Text>
      <Picker
          selectedValue={source}
          onValueChange={(value) => setSource(String(value))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
            <Picker.Item label="web" value="web" />
            <Picker.Item label="movil" value="movil" />
            <Picker.Item label="system" value="system" />
         
        </Picker>

      <Text style={styles.label}>Escriba una nota </Text>
      <TextInput
        placeholder="Escriba una nota"
        placeholderTextColor="#8b949e"
        value={note}
        onChangeText={setNote}
        keyboardType="default"
        style={styles.input}
      />

      <Pressable onPress={createService} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Crear (sin enviar fecha)</Text>
      </Pressable>

      <Pressable onPress={loadAll} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Refrescar</Text>
      </Pressable>

      <FlatList
        data={reservationEvent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const v = reservationById.get(item.reservation_id);

          const line1 = v ? v.showid_nombre : `reservation_id: ${item.reservation_id}`;

          const extras: string[] = [];
          if (v) extras.push(`Cliente: ${v.customer_name}`);
          if (item.note) extras.push(`Notas: ${item.note}`);
          if (item.source) extras.push(`Disposixtivo: ${item.source}`);
          if (item.event_type) extras.push(`Tipo de evento: ${item.event_type}`);
          if (item.created_at) extras.push(`Fecha: ${item.created_at}`);

          return (
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.rowText} numberOfLines={1}>{line1}</Text>
                {extras.map((t, idx) => (
                  <Text key={idx} style={styles.rowSub} numberOfLines={1}>{t}</Text>
                ))}
              </View>

              <Pressable onPress={() => removeService(item.id)}>
                <Text style={styles.del}>Eliminar</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  title: { color: "#58a6ff", fontSize: 22, fontWeight: "800", marginBottom: 10 },
  error: { color: "#ff7b72", marginBottom: 10 },
  label: { color: "#8b949e", marginBottom: 6, marginTop: 6 },

  pickerWrap: {
    backgroundColor: "#161b22",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#30363d",
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: { color: "#c9d1d9" },

  input: {
    backgroundColor: "#161b22",
    color: "#c9d1d9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#30363d",
  },

  btn: { backgroundColor: "#21262d", borderColor: "#58a6ff", borderWidth: 1, padding: 12, borderRadius: 8 },
  btnText: { color: "#58a6ff", textAlign: "center", fontWeight: "700" },

  row: {
    backgroundColor: "#161b22",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#30363d",
  },
  rowText: { color: "#c9d1d9", fontWeight: "800" },
  rowSub: { color: "#8b949e", marginTop: 2 },
  del: { color: "#ff7b72", fontWeight: "800" },
});