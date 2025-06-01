import React, { useState, useContext, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";

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

  useFocusEffect(
    useCallback(() => {
      fetchMisViajes();
    }, [])
  );

  const formatearFecha = (fechaIso: string) => {
    const fecha = new Date(fechaIso);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = String(fecha.getFullYear()).slice(-2);
    const hora = fecha.getHours();
    const minutos = String(fecha.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${anio} ${hora}:${minutos}h`;
  };

  const renderViaje = ({ item }: { item: Viaje }) => {
    const esConductor = item.conductor_id === user?.id;

    return (
      <View style={styles.viajeCard}>
        <Text style={styles.title}>
          {item.origen} ➡️ {item.destino}
        </Text>
        <Text style={styles.text}>Salida: {formatearFecha(item.fechaHoraSalida)}</Text>
        <Text style={styles.text}>Plazas disponibles: {item.plazasDisponibles}</Text>
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
      <StatusBar barStyle="light-content" backgroundColor="#344356" />
      <Text style={styles.header}>Mis viajes</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#d6765e" />
      ) : (
        <FlatList
          data={viajes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderViaje}
          ListEmptyComponent={
            <Text style={{ color: "#e2ae9c", textAlign: "center", marginTop: 20 }}>
              No estás en ningún viaje aún.
            </Text>
          }
        />
      )}
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#e2ae9c",
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
    fontSize: 16,
    marginBottom: 8,
    color: "#e2ae9c",
  },
  text: {
    color: "#9c9c96",
    marginBottom: 4,
  },
  rol: {
    fontStyle: "italic",
    marginBottom: 8,
    color: "#a54740",
  },
  cancelButton: {
    backgroundColor: "#a54740",
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
    alignItems: "center",
  },
  abandonButton: {
    backgroundColor: "#d6765e",
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
