import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { AuthContext } from "../auth/AuthContext";

type RootStackParamList = {
  DetalleViajeScreen: { viajeId: number };
};

type DetalleViajeScreenRouteProp = RouteProp<
  RootStackParamList,
  "DetalleViajeScreen"
>;

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
}

interface ViajeDetalle {
  id: number;
  origen: string;
  destino: string;
  fechaHoraSalida: string;
  fechaHoraLlegada: string;
  plazasDisponibles: number;
  conductor: Usuario;
  pasajeros: Usuario[];
}

const DetalleViajeScreen = () => {
  const route = useRoute<DetalleViajeScreenRouteProp>();
  const { viajeId } = route.params;

  const { token } = useContext(AuthContext);

  const [viaje, setViaje] = useState<ViajeDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (viajeId === undefined || viajeId === null) {
      Alert.alert("Error", "ID de viaje no válido");
      setLoading(false);
      return;
    }

    const fetchDetalles = async () => {
      if (!token) {
        Alert.alert("Error", "No estás autenticado");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://192.168.1.130:8080/viajes/${viajeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los detalles del viaje");
        }

        const data: ViajeDetalle = await response.json();
        setViaje(data);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "No se pudieron cargar los detalles del viaje");
      } finally {
        setLoading(false);
      }
    };

    fetchDetalles();
  }, [token, viajeId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <StatusBar barStyle="light-content" backgroundColor="#344356" />
        <ActivityIndicator size="large" color="#e2ae9c" />
      </SafeAreaView>
    );
  }

  if (!viaje) {
    return (
      <SafeAreaView style={styles.center}>
        <StatusBar barStyle="light-content" backgroundColor="#344356" />
        <Text style={styles.errorText}>No se encontraron detalles del viaje.</Text>
      </SafeAreaView>
    );
  }

return (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor="#344356" />

    {/* Card con datos del viaje */}
    <View style={styles.viajeCard}>
      <Text style={styles.title}>
        {viaje.origen} ➡️ {viaje.destino}
      </Text>
      <Text style={styles.text}>Salida: {new Date(viaje.fechaHoraSalida).toLocaleString()}</Text>
      <Text style={styles.text}>Llegada: {new Date(viaje.fechaHoraLlegada).toLocaleString()}</Text>
      <Text style={styles.text}>Plazas disponibles: {viaje.plazasDisponibles}</Text>
    </View>

    {/* Datos del conductor */}
    <Text style={styles.subtitle}>Conductor:</Text>
    <View style={styles.viajeCard}>
      <Text style={styles.text}>{viaje.conductor.nombre} ({viaje.conductor.email})</Text>
      {viaje.conductor.telefono && (
        <Text style={styles.text}>Teléfono: {viaje.conductor.telefono}</Text>
      )}
    </View>

    {/* Pasajeros */}
    <Text style={styles.subtitle}>Pasajeros:</Text>
    <View style={styles.viajeCard}>
      <FlatList
        data={viaje.pasajeros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.text}>- {item.nombre} ({item.email})</Text>
        )}
        ListEmptyComponent={<Text style={styles.text}>No hay pasajeros.</Text>}
      />
    </View>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
    paddingHorizontal: 16,
    backgroundColor: "#344356",
  },
  viajeCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#846761",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#151920",
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 12,
    color: "#e2ae9c",
  },
  subtitle: {
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 18,
    color: "#e2ae9c",
  },
  text: {
    color: "#9c9c96",
    marginBottom: 4,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#344356",
  },
});

export default DetalleViajeScreen;
