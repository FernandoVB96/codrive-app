import React, { useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../auth/AuthContext";

type Viaje = {
  id: number;
  origen: string;
  destino: string;
  fechaHoraSalida: string;
  plazasDisponibles: number;
};

const BuscarScreen = () => {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [plazas, setPlazas] = useState("");
  const { token } = useContext(AuthContext);

  const fetchViajes = async () => {
    try {
      if (!origen || !destino) {
        Alert.alert("Debes introducir origen y destino");
        return;
      }
      const plazasNum = Number(plazas);
      if (plazas && (isNaN(plazasNum) || plazasNum < 0)) {
        Alert.alert("Plazas debe ser un número positivo");
        return;
      }

      let url = `http://192.168.1.130:8080/viajes/disponibles?origen=${encodeURIComponent(
        origen
      )}&destino=${encodeURIComponent(destino)}`;
      if (plazas) url += `&plazasMin=${plazasNum}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al obtener viajes");
      const data: Viaje[] = await response.json();
      setViajes(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error al buscar viajes");
    }
  };

  const crearReserva = async (viajeId: number) => {
    try {
      const response = await fetch("http://192.168.1.130:8080/reservas", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ viajeId }),
      });
      if (!response.ok) throw new Error("Error al crear reserva");
      Alert.alert("Reserva creada, esperando confirmación del conductor");
      fetchViajes();
    } catch (error) {
      console.error(error);
      Alert.alert("No se pudo crear la reserva");
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#344356" />
      <Text style={styles.header}>Buscar viajes</Text>

      <TextInput
        placeholder="Origen"
        placeholderTextColor="#9c9c96"
        value={origen}
        onChangeText={setOrigen}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Destino"
        placeholderTextColor="#9c9c96"
        value={destino}
        onChangeText={setDestino}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Plazas mínimas"
        placeholderTextColor="#9c9c96"
        value={plazas}
        onChangeText={setPlazas}
        style={styles.input}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.searchButton} onPress={fetchViajes}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>

      <FlatList
        data={viajes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }: { item: Viaje }) => (
          <View style={styles.viajeCard}>
            <Text style={styles.title}>
              {item.origen} ➡️ {item.destino}
            </Text>
            <Text style={styles.text}>Salida: {formatearFecha(item.fechaHoraSalida)}</Text>
            <Text style={styles.text}>Plazas disponibles: {item.plazasDisponibles}</Text>
            <TouchableOpacity style={styles.reserveButton} onPress={() => crearReserva(item.id)}>
              <Text style={styles.buttonText}>Reservar</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: "#e2ae9c", textAlign: "center", marginTop: 20 }}>
            No hay viajes disponibles
          </Text>
        }
      />
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
  input: {
    borderWidth: 1,
    borderColor: "#846761",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: "#e2ae9c",
    backgroundColor: "#151920",
  },
  searchButton: {
    backgroundColor: "#d6765e",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
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
    marginBottom: 8,
  },
  reserveButton: {
    backgroundColor: "#a54740",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
});

export default BuscarScreen;
