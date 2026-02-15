import { useEffect, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";

import { createServiceTypeApi, deleteServiceTypeApi, listServiceTypesApi } from "../api/movieCatalog.api";
import { toArray } from "../types/drf";
import type { MovieCatalog } from "../types/movieCatalog";

function normalizeText(input: string): string {
  return input.trim();
}

export default function ServiceTypesScreen() {
  const [items, setItems] = useState<MovieCatalog[]>([]);
  const [movieTitle, setMovieTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [durationMin, setDurationMin] = useState(0);
  const [rating, setRating] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const load = async (): Promise<void> => {
    try {
      setErrorMessage("");
      const data = await listServiceTypesApi();
      setItems(toArray(data));
    } catch {
      setErrorMessage("No se pudo cargar service types. ¿Login? ¿Token?");
    }
  };

  useEffect(() => { load(); }, []);

  const createItem = async (): Promise<void> => {
    try {
      setErrorMessage("");

      const cleanName = normalizeText(movieTitle);
      if (!cleanName) return setErrorMessage("Nombre de la pelicula es requerido");

      const created = await createServiceTypeApi({
        movie_title: cleanName,
        genre: genre ? normalizeText(genre) : undefined,
        duration_min: durationMin,
        rating: rating,
        is_active: isActive,
      });

      setItems((prev) => [created, ...prev]);
      setMovieTitle("");
      setGenre("");
      setDurationMin(0);
      setRating("");
      setIsActive(true);
    } catch {
      setErrorMessage("No se pudo crear service type.");
    }
  };

  const removeItem = async (id: string): Promise<void> => {
    try {
      setErrorMessage("");
      await deleteServiceTypeApi(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch {
      setErrorMessage("No se pudo eliminar service type.");
    }
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>Catalogo de peliculas</Text>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        value={movieTitle}
        onChangeText={setMovieTitle}
        placeholder="Titulo de la pelicula"
        placeholderTextColor="#8b949e"
        style={styles.input}
      />

      <Text style={styles.label}>Genero (opcional)</Text>
      <TextInput
        value={genre}
        onChangeText={setGenre}
        placeholder="Accion, Drama, Comedia, etc."
        placeholderTextColor="#8b949e"
        style={styles.input}
      />
      <Text style={styles.label}>Duracion (minutos)</Text>
      <TextInput
        value={String(durationMin)}
        onChangeText={(text) => setDurationMin(Number(text))}
        placeholder="60"
        placeholderTextColor="#8b949e"
        style={styles.input}
      />   
      <Text style={styles.label}>Rating </Text>
      <TextInput
        value={rating}
        onChangeText={setRating}
        placeholder="PG-13"
        placeholderTextColor="#8b949e"
        style={styles.input}
      />
      <Text style={styles.label}>Activo</Text>
      <Switch
        value={isActive}
        onValueChange={setIsActive}
        style={styles.switch}
      />

      <Pressable onPress={createItem} style={styles.btn}>
        <Text style={styles.btnText}>Crear</Text>
      </Pressable>

      <Pressable onPress={load} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Refrescar</Text>
      </Pressable>
       <FlatList
    
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.rowText} numberOfLines={1}>{item.movie_title}</Text>
              {!!item.genre && <Text style={styles.rowSub} numberOfLines={1}>{item.genre}</Text>}
              {!!item.duration_min  && <Text style={styles.rowSub} numberOfLines={1}>{item.duration_min} minutos</Text>}
              {!!item.rating && <Text style={styles.rowSub} numberOfLines={1}>{item.rating}</Text>}
              {item.is_active !== undefined && <Text style={styles.rowSub} numberOfLines={1}>{item.is_active ? "Activo" : "Inactivo"}</Text>}
            </View>

            <Pressable onPress={() => removeItem(item.id)}>
              <Text style={styles.del}>Eliminar</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  title: { color: "#58a6ff", fontSize: 22, fontWeight: "800", marginBottom: 10 },
  error: { color: "#ff7b72", marginBottom: 10 },
  label: { color: "#8b949e", marginBottom: 6, marginTop: 6 },
  switch: { color: "#8b949e", marginBottom: 20, marginTop:6 },
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
  del: { color: "#ff7b72", fontWeight: "700" },
});