import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
} from "react-native";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { AuthContext } from "../auth/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";

const formatDateTime = (date: Date) =>
  new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

const PublicarScreen = () => {
  const { token, user, setUser } = useContext(AuthContext);

  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [fechaSalida, setFechaSalida] = useState(new Date());
  const [fechaLlegada, setFechaLlegada] = useState(new Date());
  const [plazas, setPlazas] = useState("");

  const [salidaTempDate, setSalidaTempDate] = useState<Date | null>(null);
  const [llegadaTempDate, setLlegadaTempDate] = useState<Date | null>(null);

  const [registroVehiculoActivo, setRegistroVehiculoActivo] = useState(false);
  const [vehiculoRegistrado, setVehiculoRegistrado] = useState(false);
  const [rolConfirmado, setRolConfirmado] = useState(false);

  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [matricula, setMatricula] = useState("");
  const [plazasDisponibles, setPlazasDisponibles] = useState("");

  const [showSalidaPicker, setShowSalidaPicker] = useState(false);
  const [showLlegadaPicker, setShowLlegadaPicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchVehiculos = async () => {
        if (!token || !user) return;
        try {
          const response = await fetch(`https://codrive-9fbg.onrender.com/usuarios/${user.id}/vehiculos`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) throw new Error("Error al obtener vehículos");
          const data = await response.json();
          setVehiculoRegistrado(Array.isArray(data) && data.length > 0);
        } catch (error) {
          console.log("No se pudo verificar vehículos:", error);
        }
      };
      fetchVehiculos();
    }, [token, user])
  );

  useEffect(() => {
    if (user?.rol !== "CONDUCTOR") {
      actualizarRolConductor();
    } else {
      setRolConfirmado(true);
    }
  }, [user]);

  const actualizarRolConductor = async () => {
    if (!token || !user) return;
    try {
      const response = await fetch("https://codrive-9fbg.onrender.com/usuarios/actualizar", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email || "",
          nombre: user.nombre || "",
          telefono: user.telefono || "",
          password: "",
          rol: "CONDUCTOR",
        }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Error al actualizar rol");
      }
      setUser({ ...user, rol: "CONDUCTOR" });
      setRegistroVehiculoActivo(true);
      setRolConfirmado(true);
    } catch (error: unknown) {
      Alert.alert(
        "Error",
        `No se pudo actualizar el rol a conductor: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  };

  const showDatePickerAndroid = (currentDate: Date, onConfirm: (date: Date) => void, onCancel: () => void) => {
    DateTimePickerAndroid.open({
      value: currentDate,
      mode: "date",
      is24Hour: true,
      onChange: (event, selectedDate) => {
        if (event?.type === "dismissed") {
          onCancel();
          return;
        }
        if (selectedDate) onConfirm(selectedDate);
      },
    });
  };

  const showTimePickerAndroid = (currentDate: Date, onConfirm: (date: Date) => void, onCancel: () => void) => {
    DateTimePickerAndroid.open({
      value: currentDate,
      mode: "time",
      is24Hour: true,
      onChange: (event, selectedTime) => {
        if (event?.type === "dismissed") {
          onCancel();
          return;
        }
        if (selectedTime) onConfirm(selectedTime);
      },
    });
  };

  const openSalidaPicker = () => {
    if (Platform.OS === "android") {
      showDatePickerAndroid(
        fechaSalida,
        (date) => {
          setSalidaTempDate(date);
          showTimePickerAndroid(
            date,
            (time) => {
              const combinedDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                time.getHours(),
                time.getMinutes()
              );
              setFechaSalida(combinedDate);
              setSalidaTempDate(null);
            },
            () => setSalidaTempDate(null)
          );
        },
        () => {}
      );
    } else {
      setShowSalidaPicker(true);
    }
  };

  const openLlegadaPicker = () => {
    if (Platform.OS === "android") {
      showDatePickerAndroid(
        fechaLlegada,
        (date) => {
          setLlegadaTempDate(date);
          showTimePickerAndroid(
            date,
            (time) => {
              const combinedDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                time.getHours(),
                time.getMinutes()
              );
              setFechaLlegada(combinedDate);
              setLlegadaTempDate(null);
            },
            () => setLlegadaTempDate(null)
          );
        },
        () => {}
      );
    } else {
      setShowLlegadaPicker(true);
    }
  };

  const onChangeSalida = (_event: any, selectedDate?: Date) => {
    setShowSalidaPicker(false);
    if (selectedDate) setFechaSalida(selectedDate);
  };

  const onChangeLlegada = (_event: any, selectedDate?: Date) => {
    setShowLlegadaPicker(false);
    if (selectedDate) setFechaLlegada(selectedDate);
  };

const handleAgregarVehiculo = async () => {
  const plazasNum = parseInt(plazasDisponibles, 10);
  if (
    !marca.trim() ||
    marca.trim().length < 2 ||
    !modelo.trim() ||
    modelo.trim().length < 2 ||
    !matricula.trim() ||
    matricula.trim().length < 2 ||
    isNaN(plazasNum) ||
    plazasNum <= 0 ||
    plazasNum > 9
  ) {
    Alert.alert(
      "Error",
      "Completa todos los datos del vehículo correctamente. Las plazas deben ser entre 1 y 9."
    );
    return;
  }
    if (!token || !user) return;
    try {
      const response = await fetch(
        `https://codrive-9fbg.onrender.com/usuarios/${user.id}/vehiculos`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            marca,
            modelo,
            matricula,
            plazasDisponibles: plazasNum,
          }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al agregar vehículo");
      }
      Alert.alert("Vehículo agregado con éxito");
      setMarca("");
      setModelo("");
      setMatricula("");
      setPlazasDisponibles("");
      setRegistroVehiculoActivo(false);
      setVehiculoRegistrado(true);
      setRolConfirmado(true);
    } catch (error: unknown) {
      Alert.alert(
        "Error",
        `No se pudo agregar vehículo: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  };

const handlePublicar = async () => {
  const plazasNum = parseInt(plazas, 10);
  const now = new Date();
  const margenMinutos = 1; // para evitar problemas milisegundos y segundos
  const fechaLimite = new Date(now.getTime() - margenMinutos * 60000);

  if (
    !origen.trim() ||
    origen.trim().length < 2 ||
    origen.trim().length > 50 ||
    !destino.trim() ||
    destino.trim().length < 2 ||
    destino.trim().length > 50
  ) {
    Alert.alert(
      "Error",
      "Origen y destino deben tener entre 2 y 50 caracteres."
    );
    return;
  }

  if (
    isNaN(plazasNum) ||
    plazasNum <= 0 ||
    plazasNum > 9
  ) {
    Alert.alert("Error", "Las plazas deben ser un número entre 1 y 9.");
    return;
  }

  if (fechaSalida < fechaLimite) {
    Alert.alert("Error", "La fecha de salida no puede ser en el pasado.");
    return;
  }

  if (fechaLlegada <= fechaSalida) {
    Alert.alert("Error", "La fecha de llegada debe ser posterior a la de salida.");
    return;
  }

  if (!token) return;
    try {
      const response = await fetch("https://codrive-9fbg.onrender.com/viajes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origen,
          destino,
          fechaHoraSalida: fechaSalida.toISOString(),
          fechaHoraLlegada: fechaLlegada.toISOString(),
          plazasTotales: plazasNum,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.log("Respuesta del servidor:", data);
        throw new Error(data.message || "Error al crear viaje");
      }
      Alert.alert("Viaje publicado con éxito");
      setOrigen("");
      setDestino("");
      setPlazas("");
      setFechaSalida(new Date());
      setFechaLlegada(new Date());
    } catch (error: unknown) {
      Alert.alert(
        "Error",
        `No se pudo publicar viaje: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>¡Prepárate para tu próximo viaje! 🚗💨</Text>

        {!vehiculoRegistrado && (
          <>
            <Text style={styles.label}>
              Antes de publicar un viaje necesitamos los datos de tu vehículo.
            </Text>

            {!registroVehiculoActivo ? (
              <PrimaryButton label="Registrar vehículo" onPress={() => setRegistroVehiculoActivo(true)} />
            ) : (
              <>
                <Text style={styles.label}>Marca:</Text>
                <InputField
                  value={marca}
                  onChangeText={setMarca}
                  placeholder="Marca del vehículo"
                  placeholderTextColor="#9c9c96"
                />

                <Text style={styles.label}>Modelo:</Text>
                <InputField
                  value={modelo}
                  onChangeText={setModelo}
                  placeholder="Modelo del vehículo"
                  placeholderTextColor="#9c9c96"
                />

                <Text style={styles.label}>Matrícula:</Text>
                <InputField
                  value={matricula}
                  onChangeText={setMatricula}
                  placeholder="Matrícula"
                  placeholderTextColor="#9c9c96"
                />

                <Text style={styles.label}>Plazas disponibles:</Text>
                <InputField
                  value={plazasDisponibles}
                  onChangeText={setPlazasDisponibles}
                  placeholder="Número de plazas disponibles"
                  placeholderTextColor="#9c9c96"
                  keyboardType="numeric"
                />

                <PrimaryButton label="Agregar vehículo" onPress={handleAgregarVehiculo} />
              </>
            )}
          </>
        )}

        {vehiculoRegistrado && rolConfirmado && !registroVehiculoActivo && (
          <>
            <Text style={styles.label}>¿De dónde quieres salir?</Text>
            <InputField
              value={origen}
              onChangeText={setOrigen}
              placeholder="Lugar de origen"
              placeholderTextColor="#9c9c96"
            />

            <Text style={styles.label}>¿A dónde quieres ir?</Text>
            <InputField
              value={destino}
              onChangeText={setDestino}
              placeholder="Lugar de destino"
              placeholderTextColor="#9c9c96"
            />

            <Text style={styles.label}>¿Cuándo quieres salir?</Text>
            <PrimaryButton label={formatDateTime(fechaSalida)} onPress={openSalidaPicker} />
            {showSalidaPicker && (
              <DateTimePicker
                value={fechaSalida}
                mode="datetime"
                display="spinner"
                onChange={onChangeSalida}
                locale="es-ES"
                minimumDate={new Date()}
              />
            )}

            <Text style={styles.label}>¿Cuándo quieres llegar?</Text>
            <PrimaryButton label={formatDateTime(fechaLlegada)} onPress={openLlegadaPicker} />
            {showLlegadaPicker && (
              <DateTimePicker
                value={fechaLlegada}
                mode="datetime"
                display="spinner"
                onChange={onChangeLlegada}
                locale="es-ES"
                minimumDate={fechaSalida}
              />
            )}

            <Text style={styles.label}>¿Cuántas plazas disponibles quieres ofrecer?</Text>
            <InputField
              value={plazas}
              onChangeText={setPlazas}
              placeholder="Número de plazas"
              placeholderTextColor="#9c9c96"
              keyboardType="numeric"
            />

            <PrimaryButton label="Publicar viaje" onPress={handlePublicar} />
          </>
        )}
      </ScrollView>
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
  scrollView: {
    padding: 0,
  },
  title: {
    paddingTop: 57,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#e2ae9c",
  },
  label: {
    color: "#c5c5c5",
    marginTop: 10,
    marginBottom: 5,
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

export default PublicarScreen;
