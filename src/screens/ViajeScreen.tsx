// src/screens/ViajeScreen.tsx
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { AuthContext } from "../auth/AuthContext";

type Viaje = {
  id: number;
  origen: string;
  destino: string;
  fechaHoraSalida: string;
  plazasDisponibles: number;
  conductor_id: number;
};

const ViajeScreen = () => {
  const { token, user } = useContext(AuthContext);
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMisViajes = async () => {
    try {
      const response = await fetch("http://192.168.1.130:8080/viajes/mis-viajes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("No se pudieron obtener los viajes");
      const data: Viaje[] = await response.json();
      setViajes(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error al obtener tus viajes");
    } finally {
      setLoading(false);
    }
  };

  const cancelarViaje = async (viajeId: number) => {
    try {
      const response = await fetch(`http://192.168.1.130:8080/viajes/${viajeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al cancelar el viaje");
      Alert.alert("Viaje cancelado");
      fetchMisViajes();
    } catch (error) {
      console.error(error);
      Alert.alert("No se pudo cancelar el viaje");
    }
  };

  const abandonarViaje = async (viajeId: number) => {
    try {
      const response = await fetch(`http://192.168.1.130:8080/viajes/${viajeId}/abandonar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al abandonar el viaje");
      Alert.alert("Has abandonado el viaje");
      fetchMisViajes();
    } catch (error) {
      console.error(error);
      Alert.alert("No se pudo abandonar el viaje");
    }
  };

  useEffect(() => {
    fetchMisViajes();
  }, []);

  const renderViaje = ({ item }: { item: Viaje }) => {
    const esConductor = item.conductor_id === user?.id;

    return (
      <View style={styles.viajeCard}>
        <Text style={styles.title}>{item.origen} ➡️ {item.destino}</Text>
        <Text>Salida: {item.fechaHoraSalida}</Text>
        <Text>Plazas disponibles: {item.plazasDisponibles}</Text>
        <Text style={styles.rol}>{esConductor ? "Eres el conductor" : "Eres pasajero"}</Text>

        {esConductor ? (
          <TouchableOpacity style={styles.cancelButton} onPress={() => cancelarViaje(item.id)}>
            <Text style={styles.buttonText}>Cancelar viaje</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.abandonButton} onPress={() => abandonarViaje(item.id)}>
            <Text style={styles.buttonText}>Abandonar viaje</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Text style={styles.header}>Mis viajes</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={viajes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderViaje}
          ListEmptyComponent={<Text>No estás en ningún viaje aún.</Text>}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0, // Esto asegura que no se superponga con la status bar
    paddingHorizontal: 16,
    backgroundColor: "white",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  viajeCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  rol: {
    fontStyle: "italic",
    marginBottom: 8,
  },
  cancelButton: {
    backgroundColor: "#e53935",
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
    alignItems: "center",
  },
  abandonButton: {
    backgroundColor: "#f57c00",
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default ViajeScreen;
