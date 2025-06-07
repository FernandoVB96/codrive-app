import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  StatusBar,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../auth/AuthContext";
// import * as Notifications from "expo-notifications";  // <-- Comentado

import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";

type Viaje = {
  id: number;
  origen: string;
  destino: string;
  fechaHoraSalida: string;
  fechaHoraLlegada: string;
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
    /*
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        Alert.alert(
          "Nueva notificación",
          notification.request.content.body || "Tienes una actualización"
        );
      }
    );

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(() => {
        fetchViajes();
      });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
    */
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#344356" />

      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.header}>Buscar viajes</Text>
        <InputField placeholder="Origen" value={origen} onChangeText={setOrigen} />
        <InputField placeholder="Destino" value={destino} onChangeText={setDestino} />
        <InputField
          placeholder="Plazas mínimas"
          value={plazas}
          keyboardType="numeric"
          onChangeText={setPlazas}
        />
        <PrimaryButton label="Buscar" onPress={fetchViajes} backgroundColor="#d6765e" />
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
            <Text style={styles.text}>Salida: {formatearFecha(item.fechaHoraSalida)}</Text>
            <Text style={styles.text}>Llegada: {formatearFecha(item.fechaHoraLlegada)}</Text>
            <Text style={styles.text}>Plazas disponibles: {item.plazasDisponibles}</Text>
            {item.plazasDisponibles > 0 ? (
              <PrimaryButton
                label="Reservar"
                backgroundColor="#5cb85c"
                onPress={() =>
                  Alert.alert(
                    "Confirmar reserva",
                    `¿Quieres reservar plaza para el viaje ${item.origen} -> ${item.destino}?`,
                    [
                      { text: "No" },
                      { text: "Sí", onPress: () => crearReserva(item.id) },
                    ]
                  )
                }
              />
            ) : (
              <Text style={styles.noSeats}>Sin plazas disponibles</Text>
            )}
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
  form: {
    padding: 16,
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
  noSeats: {
    marginTop: 8,
    color: "#ccc",
    fontStyle: "italic",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#e2ae9c",
  },
});

export default BuscarScreen;
