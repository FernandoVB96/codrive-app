import React, { useState, useContext } from "react";
import { View, Text, FlatList, Button, StyleSheet, Alert, TextInput } from "react-native";
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

      let url = `http://192.168.1.130:8080/viajes/disponibles?origen=${encodeURIComponent(origen)}&destino=${encodeURIComponent(destino)}`;
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

  const unirseAViaje = async (viajeId: number) => {
    try {
      const response = await fetch(`http://192.168.1.130:8080/viajes/${viajeId}/unirse`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Error al unirse al viaje");
      Alert.alert("Te has unido al viaje!");
      fetchViajes();
    } catch (error) {
      console.error(error);
      Alert.alert("No se pudo unir al viaje");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Inputs y botones */}
        <TextInput
          placeholder="Origen"
          value={origen}
          onChangeText={setOrigen}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Destino"
          value={destino}
          onChangeText={setDestino}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Plazas mínimas"
          value={plazas}
          onChangeText={setPlazas}
          style={styles.input}
          keyboardType="numeric"
        />
        <Button title="Buscar" onPress={fetchViajes} />

        {/* Lista */}
        <FlatList
          data={viajes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }: { item: Viaje }) => (
            <View style={styles.viaje}>
              <Text style={styles.title}>{item.origen} ➡️ {item.destino}</Text>
              <Text>Salida: {item.fechaHoraSalida}</Text>
              <Text>Plazas disponibles: {item.plazasDisponibles}</Text>
              <Button title="Unirse" onPress={() => unirseAViaje(item.id)} />
            </View>
          )}
          ListEmptyComponent={<Text>No hay viajes disponibles</Text>}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  viaje: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default BuscarScreen;