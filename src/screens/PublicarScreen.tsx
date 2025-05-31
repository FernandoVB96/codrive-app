import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { AuthContext } from "../auth/AuthContext";

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

  // Vehículo
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [matricula, setMatricula] = useState("");
  const [plazasDisponibles, setPlazasDisponibles] = useState("");

  // Control iOS pickers
  const [showSalidaPicker, setShowSalidaPicker] = useState(false);
  const [showLlegadaPicker, setShowLlegadaPicker] = useState(false);

  // Para que al cancelar no pregunte siempre
  const [rolPreguntado, setRolPreguntado] = useState(false);

  // Para evitar infinite loops al actualizar user
  useEffect(() => {
    if (!rolPreguntado && user?.rol !== "CONDUCTOR") {
      Alert.alert(
        "No eres conductor",
        "¿Quieres ser conductor?",
        [
          {
            text: "No",
            onPress: () => setRolPreguntado(true),
            style: "cancel",
          },
          {
            text: "Sí",
            onPress: () => actualizarRolConductor(),
          },
        ],
        { cancelable: false }
      );
    } else if (user?.rol === "CONDUCTOR") {
      setRolConfirmado(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, rolPreguntado]);

  // Función para actualizar rol - con todos los datos necesarios
  const actualizarRolConductor = async () => {
    if (!token || !user) return;

    try {
      const response = await fetch(
        "http://192.168.1.130:8080/usuarios/actualizar",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email || "",
            nombre: user.nombre || "",
            telefono: user.telefono || "",
            password: "", // No cambiar contraseña
            rol: "CONDUCTOR",
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Error al actualizar rol");
      }

      const updatedUser = { ...user, rol: "CONDUCTOR" };
      setUser(updatedUser);
      setRolPreguntado(true);
      setRegistroVehiculoActivo(true);
    } catch (error: unknown) {
      let message = "Error desconocido";
      if (error instanceof Error) {
        message = error.message;
      }
      Alert.alert("Error", "No se pudo actualizar el rol a conductor: " + message);
    }
  };

  // Manejo pickers Android
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
        if (selectedDate) {
          onConfirm(selectedDate);
        }
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
        if (selectedTime) {
          onConfirm(selectedTime);
        }
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

  // iOS pickers
  const onChangeSalida = (event: any, selectedDate?: Date) => {
    setShowSalidaPicker(false);
    if (selectedDate) setFechaSalida(selectedDate);
  };

  const onChangeLlegada = (event: any, selectedDate?: Date) => {
    setShowLlegadaPicker(false);
    if (selectedDate) setFechaLlegada(selectedDate);
  };

  // Agregar vehículo
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
      let message = "Error desconocido";
      if (error instanceof Error) {
        message = error.message;
      }
      Alert.alert("Error", "No se pudo agregar vehículo: " + message);
    }
  };

  // Publicar viaje
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
      let message = "Error desconocido";
      if (error instanceof Error) {
        message = error.message;
      }
      Alert.alert("No se pudo publicar el viaje", message);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Cargando usuario...</Text>
      </View>
    );
  }

  if (user.rol !== "CONDUCTOR" && !rolPreguntado) {
    return (
      <View style={styles.container}>
        <Text>Necesitas ser conductor para publicar viajes.</Text>
      </View>
    );
  }

  if (user.rol !== "CONDUCTOR" && rolPreguntado) {
    return (
      <View style={styles.container}>
        <Text>Por favor actualiza tu rol para publicar viajes.</Text>
      </View>
    );
  }

  if (registroVehiculoActivo && !vehiculoRegistrado) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Registrar vehículo</Text>
          <TextInput
            placeholder="Marca"
            value={marca}
            onChangeText={setMarca}
            style={styles.input}
          />
          <TextInput
            placeholder="Modelo"
            value={modelo}
            onChangeText={setModelo}
            style={styles.input}
          />
          <TextInput
            placeholder="Matrícula"
            value={matricula}
            onChangeText={setMatricula}
            style={styles.input}
          />
          <TextInput
            placeholder="Plazas disponibles"
            value={plazasDisponibles}
            onChangeText={setPlazasDisponibles}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button title="Agregar vehículo" onPress={handleAgregarVehiculo} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Formulario para publicar viaje
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Publicar Viaje</Text>

        <TextInput
          placeholder="Origen"
          value={origen}
          onChangeText={setOrigen}
          style={styles.input}
        />
        <TextInput
          placeholder="Destino"
          value={destino}
          onChangeText={setDestino}
          style={styles.input}
        />

        <Text style={styles.label}>Fecha y hora de salida</Text>
        <Button title={fechaSalida.toLocaleString()} onPress={openSalidaPicker} />
        {showSalidaPicker && (
          <DateTimePicker
            value={fechaSalida}
            mode="datetime"
            display="default"
            onChange={onChangeSalida}
          />
        )}

        <Text style={styles.label}>Fecha y hora de llegada</Text>
        <Button title={fechaLlegada.toLocaleString()} onPress={openLlegadaPicker} />
        {showLlegadaPicker && (
          <DateTimePicker
            value={fechaLlegada}
            mode="datetime"
            display="default"
            onChange={onChangeLlegada}
          />
        )}

        <TextInput
          placeholder="Número de plazas"
          value={plazas}
          onChangeText={setPlazas}
          keyboardType="numeric"
          style={styles.input}
        />

        <Button title="Publicar viaje" onPress={handlePublicar} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaeaea",
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  label: {
    fontWeight: "600",
    marginBottom: 5,
  },
});

export default PublicarScreen;
