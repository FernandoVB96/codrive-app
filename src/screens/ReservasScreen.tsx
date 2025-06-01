import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
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

const ReservasScreen = () => {
  const { user, token } = useContext(AuthContext);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReservas = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const url =
        user.rol === "CONDUCTOR"
          ? `http://192.168.1.130:8080/reservas/mis-viajes/reservas`
          : `http://192.168.1.130:8080/reservas/usuario/${user.id}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al cargar reservas");
      const data = await response.json();
      setReservas(data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las reservas.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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
      fetchReservas();
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
      fetchReservas();
    } catch (error) {
      Alert.alert("Error", "No se pudo cancelar la reserva.");
    }
  };

  const formatearFecha = (fechaIso: string) => {
    const fecha = new Date(fechaIso);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = String(fecha.getFullYear()).slice(-2);
    const hora = fecha.getHours();
    const minutos = String(fecha.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${anio} ${hora}:${minutos}h`;
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#e2ae9c" />
      </SafeAreaView>
    );
  }

  if (reservas.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.noReservasText}>No tienes reservas.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchReservas}
            colors={["#e2ae9c"]}
            tintColor="#e2ae9c"
          />
        }
        renderItem={({ item }) => {
          const esReservaPendiente = item.estado === "PENDIENTE";

          return (
            <View style={styles.reserva}>
              <Text style={styles.title}>
                {item.viaje.origen} ➡️ {item.viaje.destino}
              </Text>
              <Text style={styles.text}>Fecha salida: {formatearFecha(item.viaje.fechaHoraSalida)}</Text>
              <Text style={styles.text}>Estado: {item.estado}</Text>
              <Text style={styles.text}>Conductor: {item.viaje.conductor.nombre}</Text>
              <Text style={styles.text}>Pasajero: {item.usuario.nombre}</Text>

              {esReservaPendiente && user.rol === "CONDUCTOR" && (
                <View style={{ flexDirection: "row", marginTop: 12 }}>
                  <TouchableOpacity
                    style={[styles.button, styles.confirmButton]}
                    onPress={() =>
                      Alert.alert(
                        "Confirmar reserva",
                        "¿Seguro que quieres confirmar la reserva?",
                        [
                          { text: "No" },
                          { text: "Sí", onPress: () => confirmarReserva(item.id) },
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
                          { text: "Sí", onPress: () => cancelarReserva(item.id) },
                        ]
                      )
                    }
                  >
                    <Text style={styles.buttonText}>Rechazar</Text>
                  </TouchableOpacity>
                </View>
              )}

              {esReservaPendiente && user.rol !== "CONDUCTOR" && (
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton, { marginTop: 12 }]}
                  onPress={() =>
                    Alert.alert(
                      "Cancelar reserva",
                      "¿Seguro que quieres cancelar la reserva?",
                      [
                        { text: "No" },
                        { text: "Sí", onPress: () => cancelarReserva(item.id) },
                      ]
                    )
                  }
                >
                  <Text style={styles.buttonText}>Cancelar reserva</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#344356",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  reserva: {
    backgroundColor: "#151920",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noReservasText: {
    color: "#e2ae9c",
    fontSize: 18,
  },
});

export default ReservasScreen;
