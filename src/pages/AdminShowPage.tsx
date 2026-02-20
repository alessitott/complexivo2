import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Show, listShowsApi, createShowApi, updateShowApi, deleteShowApi } from "../api/shows.api";

export default function AdminShowPage() {
  const [items, setItems] = useState<Show[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [movieTitle, setMovieTitle] = useState("");
  const [room, setRoom] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [availableSeats, setAvailableSeats] = useState<number>(0);

  const load = async () => {
    try {
      setError("");
      const data = await listShowsApi();
      setItems(data.results);
    } catch {
      setError("No se pudo cargar shows. ¿Login? ¿Token admin?");
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setEditId(null);
    setMovieTitle("");
    setRoom("");
    setPrice(0);
    setAvailableSeats(0);
  };

  const save = async () => {
    try {
      setError("");
      if (!movieTitle.trim()) return setError("El título de la película es requerido");
      if (!room.trim()) return setError("La sala es requerida");

      const payload = {
        movie_title: movieTitle.trim(),
        room: room.trim(),
        price: Number(price),
        available_seats: Number(availableSeats),
      };

      if (editId) await updateShowApi(editId, payload);
      else await createShowApi(payload);

      resetForm();
      await load();
    } catch {
      setError("No se pudo guardar show. ¿Token admin?");
    }
  };

  const startEdit = (s: Show) => {
    setEditId(s.id);
    setMovieTitle(s.movie_title);
    setRoom(s.room);
    setPrice(s.price);
    setAvailableSeats(s.available_seats);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteShowApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar show. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Shows (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Título de Película"
              value={movieTitle}
              onChange={(e) => setMovieTitle(e.target.value)}
              fullWidth
              inputProps={{ maxLength: 120 }}
            />
            <TextField
              label="Sala"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              sx={{ width: 200 }}
              inputProps={{ maxLength: 20 }}
            />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Precio"
              value={price}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*\.?\d{0,2}$/.test(val) || val === "") setPrice(val as any);
              }}
              sx={{ width: 180 }}
            />
            <TextField
              label="Asientos Disponibles"
              type="number"
              value={availableSeats}
              onChange={(e) => setAvailableSeats(Number(e.target.value))}
              sx={{ width: 200 }}
              inputProps={{ min: 0 }}
            />

            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={resetForm}>Limpiar</Button>
            <Button variant="outlined" onClick={load}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Título Película</TableCell>
              <TableCell>Sala</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Asientos Disponibles</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.id}</TableCell>
                <TableCell>{s.movie_title}</TableCell>
                <TableCell>{s.room}</TableCell>
                <TableCell>${s.price}</TableCell>
                <TableCell>{s.available_seats}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(s)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(s.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
