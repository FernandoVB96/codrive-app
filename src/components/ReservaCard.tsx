import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { AuthContext } from "../auth/AuthContext";

type Usuario = {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  rol: string;
};

type Viaje = {
  id: number;
  origen: string;
  destino: string;
  fechaHoraSalida: string;
  fechaHoraLlegada: string;
  plazasTotales: number;
  plazasDisponibles: number;
  conductor: Usuario;
  pasajeros: Usuario[];
};

type Reserva = {
  id: number;
  usuario: Usuario;
  viaje: Viaje;
  fechaReserva: string;
  estado: string;
};

type Props = {
  reserva: Reserva;
  onActualizar: () => void; // callback para refrescar la lista después de cambios
};

const ReservaCard = ({ reserva, onActualizar }: Props) => {
  const { user, token } = useContext(AuthContext);

  const formatearFecha = (fechaIso: string) => {
    const fecha = new Date(fechaIso);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = String(fecha.getFullYear()).slice(-2);
    const hora = fecha.getHours();
    const minutos = String(fecha.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${anio} ${hora}:${minutos}h`;
  };

  const confirmarReserva = async (id: number) => {
    try {
      const response = await fetch(
        `http://192.168.1.130:8080/reservas/${id}/confirmar`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Error al confirmar reserva");
      Alert.alert("Reserva confirmada");
      onActualizar();
    } catch (error) {
      Alert.alert("Error", "No se pudo confirmar la reserva.");
    }
  };

  const cancelarReserva = async (id: number) => {
    try {
      const response = await fetch(
        `http://192.168.1.130:8080/reservas/${id}/cancelar`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Error al cancelar reserva");
      Alert.alert("Reserva cancelada");
      onActualizar();
    } catch (error) {
      Alert.alert("Error", "No se pudo cancelar la reserva.");
    }
  };

  const esReservaPendiente = reserva.estado === "PENDIENTE";

  // Cambia el fondo según estado
  let backgroundColor = "#151920"; // color default
  switch (reserva.estado.toUpperCase()) {
    case "CANCELADA":
      backgroundColor = "rgba(255, 0, 0, 0.2)"; // rojo suave
      break;
    case "CONFIRMADA":
      backgroundColor = "rgba(0, 128, 0, 0.2)"; // verde suave
      break;
  }

  return (
    <View style={[styles.reserva, { backgroundColor }]}>
      <Text style={styles.title}>
        {reserva.viaje.origen} ➡️ {reserva.viaje.destino}
      </Text>
      <Text style={styles.text}>
        Fecha salida: {formatearFecha(reserva.viaje.fechaHoraSalida)}
      </Text>
      <Text style={styles.text}>Estado: {reserva.estado}</Text>
      <Text style={styles.text}>Conductor: {reserva.viaje.conductor.nombre}</Text>
      {/* Aquí quité la línea que mostraba el pasajero */}

      {esReservaPendiente && user?.rol === "CONDUCTOR" && (
        <View style={{ flexDirection: "row", marginTop: 12 }}>
          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={() =>
              Alert.alert(
                "Confirmar reserva",
                "¿Seguro que quieres confirmar la reserva?",
                [
                  { text: "No" },
                  { text: "Sí", onPress: () => confirmarReserva(reserva.id) },
                ]
              )
            }
          >
            <Text style={styles.buttonText}>Aceptar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() =>
              Alert.alert(
                "Cancelar reserva",
                "¿Seguro que quieres cancelar la reserva?",
                [
                  { text: "No" },
                  { text: "Sí", onPress: () => cancelarReserva(reserva.id) },
                ]
              )
            }
          >
            <Text style={styles.buttonText}>Rechazar</Text>
          </TouchableOpacity>
        </View>
      )}

      {esReservaPendiente && user?.rol !== "CONDUCTOR" && (
        <TouchableOpacity
          style={[styles.button, styles.cancelButton, { marginTop: 12 }]}
          onPress={() =>
            Alert.alert(
              "Cancelar reserva",
              "¿Seguro que quieres cancelar la reserva?",
              [
                { text: "No" },
                { text: "Sí", onPress: () => cancelarReserva(reserva.id) },
              ]
            )
          }
        >
          <Text style={styles.buttonText}>Cancelar reserva</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  reserva: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#846761",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#151920",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 16,
    color: "#e2ae9c",
  },
  text: {
    color: "#ffffff",
    marginBottom: 2,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  confirmButton: {
    backgroundColor: "#5cb85c",
  },
  cancelButton: {
    backgroundColor: "#d9534f",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ReservaCard;
