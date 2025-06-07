import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
} from "react-native";
import { AuthContext } from "../auth/AuthContext";
// import * as Notifications from "expo-notifications";  // <-- Comentado

import ReservaCard from "../components/ReservaCard";

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

type EstadoReserva = "PENDIENTE" | "CONFIRMADA" | "CANCELADA" | string;

type Reserva = {
  id: number;
  usuario: Usuario;
  viaje: Viaje;
  fechaReserva: string;
  estado: EstadoReserva;
};

const ReservasScreen = () => {
  const { user, token } = useContext(AuthContext);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReservas = async () => {
    if (!user) {
      console.log("No hay usuario logueado.");
      return;
    }

    setLoading(true);

    try {
      const reservasPasajeroUrl = `https://codrive-9fbg.onrender.com/reservas/usuario/${user.id}`;
      const headers = { Authorization: `Bearer ${token}` };

      // 🟢 Fetch reservas como pasajero
      const pasajeroResp = await fetch(reservasPasajeroUrl, { headers });

      if (!pasajeroResp.ok) {
        throw new Error("Error al cargar reservas como pasajero");
      }

      const reservasPasajero = await pasajeroResp.json();

      let todasLasReservas = Array.isArray(reservasPasajero)
        ? reservasPasajero
        : [];

      // 🟡 Si es conductor, también pedimos sus viajes
      if (user.rol?.toUpperCase() === "CONDUCTOR") {
        const conductorUrl = `https://codrive-9fbg.onrender.com/reservas/mis-viajes/reservas`;

        const conductorResp = await fetch(conductorUrl, { headers });

        if (!conductorResp.ok) {
          throw new Error("Error al cargar reservas como conductor");
        }

        const reservasConductor = await conductorResp.json();

        if (Array.isArray(reservasConductor)) {
          const idsExistentes = new Set(todasLasReservas.map((r) => r.id));
          reservasConductor.forEach((res) => {
            if (!idsExistentes.has(res.id)) todasLasReservas.push(res);
          });
        }
      }

      // Ordenar reservas: PENDIENTE (1), CONFIRMADA (2), CANCELADA (3)
      const prioridad = {
        PENDIENTE: 1,
        CONFIRMADA: 2,
        CANCELADA: 3,
      };

      todasLasReservas.sort((a, b) => {
        const prioridadA = prioridad[a.estado as keyof typeof prioridad] ?? 99;
        const prioridadB = prioridad[b.estado as keyof typeof prioridad] ?? 99;
        return prioridadA - prioridadB;
      });

      setReservas(todasLasReservas);
    } catch (error) {
      console.error("Error en fetchReservas:", error);
      Alert.alert("Error", "No se pudieron cargar las reservas.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReservas();

    /*
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        Alert.alert(
          "Nueva notificación",
          notification.request.content.body || "Tienes una actualización"
        );
        fetchReservas();
      }
    );

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(() => {
        fetchReservas();
      });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
    */
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReservas();
  };

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
      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
        </View>
      </View>
      <Text style={styles.header}>Reservas de viajes</Text>
      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#e2ae9c"]}
            tintColor="#e2ae9c"
          />
        }
        renderItem={({ item }) => (
          <ReservaCard reserva={item} onActualizar={fetchReservas} />
        )}
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noReservasText: {
    color: "#e2ae9c",
    fontSize: 18,
  },
  header: {
    paddingTop: 57,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#e2ae9c",
  },
  logoContainer: {
    position: "absolute",
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 8 : 24,
    left: 16,
    zIndex: 10,
  },
  logoWrapper: {
    backgroundColor: "#e2ae9c",
    borderRadius: 50,
    padding: 6,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
});

export default ReservasScreen;
