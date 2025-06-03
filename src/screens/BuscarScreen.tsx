import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../auth/AuthContext";
import * as Notifications from "expo-notifications";

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

  useEffect(() => {
    // Listener para notificaciones recibidas en foreground
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        Alert.alert(
          "Nueva notificación",
          notification.request.content.body || "Tienes una actualización"
        );
      }
    );

    // Listener para respuesta a notificaciones (cuando el usuario toca la notificación)
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(() => {
        fetchViajes();
      });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Origen"
          value={origen}
          onChangeText={setOrigen}
        />
        <TextInput
          style={styles.input}
          placeholder="Destino"
          value={destino}
          onChangeText={setDestino}
        />
        <TextInput
          style={styles.input}
          placeholder="Plazas mínimas"
          value={plazas}
          keyboardType="numeric"
          onChangeText={setPlazas}
        />
        <TouchableOpacity style={styles.button} onPress={fetchViajes}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={viajes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.viaje}>
            <Text style={styles.title}>
              {item.origen} ➡️ {item.destino}
            </Text>
            <Text style={styles.text}>
              Salida: {formatearFecha(item.fechaHoraSalida)}
            </Text>
            <Text style={styles.text}>
              Plazas disponibles: {item.plazasDisponibles}
            </Text>
            <TouchableOpacity
              style={styles.reserveButton}
              onPress={() => {
                Alert.alert(
                  "Confirmar reserva",
                  `¿Quieres reservar plaza para el viaje ${item.origen} -> ${item.destino}?`,
                  [
                    { text: "No" },
                    { text: "Sí", onPress: () => crearReserva(item.id) },
                  ]
                );
              }}
            >
              <Text style={styles.buttonText}>Reservar</Text>
            </TouchableOpacity>
          </View>
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
  form: {
    padding: 16,
  },
  input: {
    backgroundColor: "#151920",
    color: "white",
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#e2ae9c",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    color: "#344356",
  },
  viaje: {
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
    marginBottom: 4,
  },
  reserveButton: {
    marginTop: 8,
    backgroundColor: "#5cb85c",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
});

export default BuscarScreen;
