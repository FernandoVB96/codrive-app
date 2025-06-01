import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from "react-native";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { AuthContext } from "../auth/AuthContext";

// Formatea fecha y hora a formato DD/MM/YYYY HH:mm
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

  // Estados del formulario viaje
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [fechaSalida, setFechaSalida] = useState(new Date());
  const [fechaLlegada, setFechaLlegada] = useState(new Date());
  const [plazas, setPlazas] = useState("");

  // Estados temporales para pickers Android
  const [salidaTempDate, setSalidaTempDate] = useState<Date | null>(null);
  const [llegadaTempDate, setLlegadaTempDate] = useState<Date | null>(null);

  // Estados para control rol y vehículo
  const [registroVehiculoActivo, setRegistroVehiculoActivo] = useState(false);
  const [vehiculoRegistrado, setVehiculoRegistrado] = useState(false);
  const [rolConfirmado, setRolConfirmado] = useState(false);
  const [rolPreguntado, setRolPreguntado] = useState(false);

  // Estados del formulario vehículo
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [matricula, setMatricula] = useState("");
  const [plazasDisponibles, setPlazasDisponibles] = useState("");

  // Estados para mostrar pickers iOS
  const [showSalidaPicker, setShowSalidaPicker] = useState(false);
  const [showLlegadaPicker, setShowLlegadaPicker] = useState(false);

  useEffect(() => {
    if (!rolPreguntado && user?.rol !== "CONDUCTOR") {
      Alert.alert(
        "No eres conductor",
        "¿Quieres ser conductor?",
        [
          { text: "No", onPress: () => setRolPreguntado(true), style: "cancel" },
          { text: "Sí", onPress: actualizarRolConductor },
        ],
        { cancelable: false }
      );
    } else if (user?.rol === "CONDUCTOR") {
      setRolConfirmado(true);
    }
  }, [user, rolPreguntado]);

  const actualizarRolConductor = async () => {
    if (!token || !user) return;

    try {
      const response = await fetch("http://192.168.1.130:8080/usuarios/actualizar", {
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
      setRolPreguntado(true);
      setRegistroVehiculoActivo(true);
    } catch (error: unknown) {
      Alert.alert(
        "Error",
        `No se pudo actualizar el rol a conductor: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  };

  // Pickers Android
  const showDatePickerAndroid = (
    currentDate: Date,
    onConfirm: (date: Date) => void,
    onCancel: () => void
  ) => {
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

  const showTimePickerAndroid = (
    currentDate: Date,
    onConfirm: (date: Date) => void,
    onCancel: () => void
  ) => {
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
    if (!marca || !modelo || !matricula || isNaN(plazasNum) || plazasNum <= 0) {
      Alert.alert("Completa todos los datos del vehículo correctamente.");
      return;
    }
    if (!token || !user) return;

    try {
      const response = await fetch(
        `http://192.168.1.130:8080/usuarios/${user.id}/vehiculos`,
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

    if (!origen || !destino || !plazas || isNaN(plazasNum) || plazasNum <= 0) {
      Alert.alert("Por favor completa todos los campos correctamente.");
      return;
    }

    if (fechaLlegada <= fechaSalida) {
      Alert.alert("La fecha de llegada debe ser posterior a la de salida.");
      return;
    }

    if (!token) return;

    try {
      const response = await fetch("http://192.168.1.130:8080/viajes", {
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
        "No se pudo publicar el viaje",
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.text}>Cargando usuario...</Text>
      </View>
    );
  }

  if (user.rol !== "CONDUCTOR" && !rolPreguntado) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.text}>Necesitas ser conductor para publicar viajes.</Text>
      </View>
    );
  }

  if (user.rol !== "CONDUCTOR" && rolPreguntado) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.text}>No tienes permiso para publicar viajes.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text
          style={{
            color: "#e2ae9c",
            fontSize: 22,
            fontWeight: "800",
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          ¡Prepárate para tu próximo     viaje! 🚗💨
        </Text>

        <Text style={styles.label}>Origen:</Text>
        <TextInput
          style={styles.input}
          value={origen}
          onChangeText={setOrigen}
          placeholder="Lugar de origen"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Destino:</Text>
        <TextInput
          style={styles.input}
          value={destino}
          onChangeText={setDestino}
          placeholder="Lugar de destino"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Fecha y hora de salida:</Text>
        <Pressable style={styles.button} onPress={openSalidaPicker}>
          <Text style={styles.buttonText}>{formatDateTime(fechaSalida)}</Text>
        </Pressable>
        {showSalidaPicker && (
          <DateTimePicker
            value={fechaSalida}
            mode="datetime"
            display="default"
            onChange={onChangeSalida}
            textColor="#fff"
          />
        )}

        <Text style={styles.label}>Fecha y hora de llegada:</Text>
        <Pressable style={styles.button} onPress={openLlegadaPicker}>
          <Text style={styles.buttonText}>{formatDateTime(fechaLlegada)}</Text>
        </Pressable>
        {showLlegadaPicker && (
          <DateTimePicker
            value={fechaLlegada}
            mode="datetime"
            display="default"
            onChange={onChangeLlegada}
            textColor="#fff"
          />
        )}

        <Text style={styles.label}>Número de plazas:</Text>
        <TextInput
          style={styles.input}
          value={plazas}
          onChangeText={setPlazas}
          placeholder="Número de plazas"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />

        {rolConfirmado && !vehiculoRegistrado && !registroVehiculoActivo && (
          <Pressable
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => setRegistroVehiculoActivo(true)}
          >
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
              Registrar vehículo
            </Text>
          </Pressable>
        )}

        {registroVehiculoActivo && (
          <>
            <Text style={styles.label}>Marca:</Text>
            <TextInput
              style={styles.input}
              value={marca}
              onChangeText={setMarca}
              placeholder="Marca del vehículo"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Modelo:</Text>
            <TextInput
              style={styles.input}
              value={modelo}
              onChangeText={setModelo}
              placeholder="Modelo del vehículo"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Matrícula:</Text>
            <TextInput
              style={styles.input}
              value={matricula}
              onChangeText={setMatricula}
              placeholder="Matrícula"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Plazas disponibles:</Text>
            <TextInput
              style={styles.input}
              value={plazasDisponibles}
              onChangeText={setPlazasDisponibles}
              placeholder="Número de plazas disponibles"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />

            <Pressable style={styles.button} onPress={handleAgregarVehiculo}>
              <Text style={styles.buttonText}>Agregar vehículo</Text>
            </Pressable>
          </>
        )}

        {vehiculoRegistrado && (
          <Pressable style={styles.button} onPress={handlePublicar}>
            <Text style={styles.buttonText}>Publicar viaje</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#344356",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    padding: 16,
    paddingBottom: 40,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 18,
  },
  label: {
    color: "#e2ae9c",
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#e2ae9c",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e2ae9c",
  },
  buttonText: {
    color: "#222",
    fontWeight: "bold",
  },
  buttonTextSecondary: {
    color: "#e2ae9c",
  },
});

export default PublicarScreen;
