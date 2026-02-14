import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Show, listShowsApi } from "../api/shows.api";
import { type Reservation, listReservationAdminApi, updateReservationApi, createReservationApi, deleteReservationApi } from "../api/reservations.api";

export default function AdminShowPage() {
  const [items, setItems] = useState<Reservation[]>([]);
  const [Shows, setShows] = useState<Show[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [show, setShow] = useState<number>(0);
  const [customerName, setCustomerName] = useState("");
  const [seats, setSeats] = useState(0);
  const [status, setStatus] = useState("");


  const load = async () => {
    try {
      setError("");
      const data = await listReservationAdminApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar vehículos. ¿Login? ¿Token admin?");
    }
  };

  const loadShows = async () => {
    try {
      const data = await listShowsApi();
      setShows(data.results); // DRF paginado
      if (!show && data.results.length > 0) setShow(data.results[0].id);
    } catch {
      // si falla, no bloquea la pantalla
    }
  };

  useEffect(() => { load(); loadShows(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!show) return setError("Seleccione una show");
      if (!customerName.trim() || ! status.trim()) return setError("customerName y  status son requeridos");

      const payload = {
        show: Number(show),
        customerName: customerName.trim(),
        seats: Number(seats),
        status:  status.trim(),

      };

      if (editId) await updateReservationApi(editId, payload);
      else await createReservationApi(payload as any);

      setEditId(null);
      setCustomerName("");
      setStatus("");
      await load();
    } catch {
      setError("No se pudo guardar vehículo. ¿Token admin?");
    }
  };

  const startEdit = (v: Reservation) => {
    setEditId(v.id);
    setShow(v.show_id);
    setCustomerName(v.customer_name);
    setSeats(v.seats);
    setStatus(v.status);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteReservationApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar vehículo. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Vehículos (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

            <FormControl sx={{ width: 260 }}>
              <InputLabel id="show-label">show</InputLabel>
              <Select
                labelId="show-label"
                label="show"
                value={show}
                onChange={(e) => setShow(Number(e.target.value))}
              >
                {Shows.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.movie_title} (#{m.id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} fullWidth />
            <TextField label="Año" type="number" value={seats} onChange={(e) => setSeats(Number(e.target.value))} sx={{ width: 160 }} />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label=" status" value={ status} onChange={(e) => setStatus(e.target.value)} sx={{ width: 220 }} />

            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setEditId(null); setCustomerName(""); setStatus(""); }}>Limpiar</Button>
            <Button variant="outlined" onClick={() => { load(); loadShows(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>show</TableCell>
              <TableCell>customerName</TableCell>
              <TableCell>Año</TableCell>
              <TableCell> status</TableCell>
              <TableCell>Color</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.showid_nombre ?? v.show_id}</TableCell>
                <TableCell>{v.customer_name}</TableCell>
                <TableCell>{v.seats}</TableCell>
                <TableCell>{v. status}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(v)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(v.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}