import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AuthContext } from "../auth/AuthContext";

interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  matricula: string;
  plazasDisponibles: number;
}

const ProfileScreen = () => {
  const { user, token, setUser, logout } = useContext(AuthContext);

  // Estados usuario
  const [nombre, setNombre] = useState(user?.nombre || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loadingPerfil, setLoadingPerfil] = useState(false);

  // Vehículos
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loadingVehiculos, setLoadingVehiculos] = useState(false);

  // Nuevo vehículo
  const [nMarca, setNMarca] = useState("");
  const [nModelo, setNModelo] = useState("");
  const [nMatricula, setNMatricula] = useState("");
  const [nPlazas, setNPlazas] = useState("");

  // Editar vehículo
  const [editVehiculoId, setEditVehiculoId] = useState<number | null>(null);
  const [editMarca, setEditMarca] = useState("");
  const [editModelo, setEditModelo] = useState("");
  const [editMatricula, setEditMatricula] = useState("");
  const [editPlazas, setEditPlazas] = useState("");

  // --- Funciones ---

  // Cargar perfil y vehículos al iniciar
  useEffect(() => {
    if (!user || !token) return;

    setLoadingPerfil(true);
    fetch("http://192.168.1.130:8080/usuarios/mi-perfil", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setNombre(data.nombre);
        setEmail(data.email);
        setLoadingPerfil(false);
      })
      .catch(() => {
        setLoadingPerfil(false);
        Alert.alert("Error", "No se pudo cargar perfil");
      });

    cargarVehiculos();
  }, [user, token]);

  const cargarVehiculos = () => {
    if (!user || !token) return;

    setLoadingVehiculos(true);
    fetch(`http://192.168.1.130:8080/vehiculos/conductor/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setVehiculos(data);
        setLoadingVehiculos(false);
      })
      .catch(() => {
        setLoadingVehiculos(false);
        Alert.alert("Error", "No se pudieron cargar los vehículos");
      });
  };

  // Actualizar perfil usuario
  const handleActualizarPerfil = () => {
    if (!token) return;
    if (!nombre.trim() || !email.trim()) {
      Alert.alert("Completa todos los campos de perfil");
      return;
    }

    fetch("http://192.168.1.130:8080/usuarios/actualizar", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: nombre.trim(),
        email: email.trim(),
        password: "", // no se cambia
        telefono: user?.telefono || "",
        rol: user?.rol || "",
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Error al actualizar perfil");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data); // actualizar contexto
        Alert.alert("Perfil actualizado");
      })
      .catch((e) => Alert.alert("Error", e.message));
  };

  // Agregar vehículo
  const handleAgregarVehiculo = () => {
    if (!token || !user) return;
    if (!nMarca.trim() || !nModelo.trim() || !nMatricula.trim() || !nPlazas.trim()) {
      Alert.alert("Completa todos los campos del vehículo");
      return;
    }
    const plazasNum = parseInt(nPlazas, 10);
    if (isNaN(plazasNum) || plazasNum <= 0) {
      Alert.alert("Número de plazas inválido");
      return;
    }

    fetch("http://192.168.1.130:8080/vehiculos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        marca: nMarca.trim(),
        modelo: nModelo.trim(),
        matricula: nMatricula.trim(),
        plazasDisponibles: plazasNum,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Error al agregar vehículo");
        }
        return res.json();
      })
      .then((nuevoVehiculo) => {
        setVehiculos((old) => [...old, nuevoVehiculo]);
        setNMarca("");
        setNModelo("");
        setNMatricula("");
        setNPlazas("");
        Alert.alert("Vehículo agregado");
      })
      .catch((e) => Alert.alert("Error", e.message));
  };

  // Eliminar vehículo
  const handleEliminarVehiculo = (id: number) => {
    Alert.alert("Confirmar", "¿Seguro que quieres eliminar este vehículo?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          if (!token) return;
          fetch(`http://192.168.1.130:8080/vehiculos/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => {
              if (!res.ok) throw new Error("Error eliminando vehículo");
              setVehiculos((old) => old.filter((v) => v.id !== id));
              Alert.alert("Vehículo eliminado");
            })
            .catch(() => Alert.alert("Error", "No se pudo eliminar vehículo"));
        },
      },
    ]);
  };

  // Preparar edición vehículo
  const comenzarEdicion = (vehiculo: Vehiculo) => {
    setEditVehiculoId(vehiculo.id);
    setEditMarca(vehiculo.marca);
    setEditModelo(vehiculo.modelo);
    setEditMatricula(vehiculo.matricula);
    setEditPlazas(String(vehiculo.plazasDisponibles));
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setEditVehiculoId(null);
  };

  // Guardar edición vehículo
  const guardarEdicion = () => {
    if (!token || editVehiculoId === null) return;

    if (!editMarca.trim() || !editModelo.trim() || !editMatricula.trim() || !editPlazas.trim()) {
      Alert.alert("Completa todos los campos del vehículo");
      return;
    }

    const plazasNum = parseInt(editPlazas, 10);
    if (isNaN(plazasNum) || plazasNum <= 0) {
      Alert.alert("Número de plazas inválido");
      return;
    }

    fetch(`http://192.168.1.130:8080/vehiculos/${editVehiculoId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        marca: editMarca.trim(),
        modelo: editModelo.trim(),
        matricula: editMatricula.trim(),
        plazasDisponibles: plazasNum,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error actualizando vehículo");
        setVehiculos((old) =>
          old.map((v) =>
            v.id === editVehiculoId
              ? {
                  ...v,
                  marca: editMarca.trim(),
                  modelo: editModelo.trim(),
                  matricula: editMatricula.trim(),
                  plazasDisponibles: plazasNum,
                }
              : v
          )
        );
        Alert.alert("Vehículo actualizado");
        setEditVehiculoId(null);
      })
      .catch(() => Alert.alert("Error", "No se pudo actualizar vehículo"));
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Cargando usuario...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {loadingPerfil ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <FlatList
            data={vehiculos}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            ListHeaderComponent={
              <>
                <Text style={styles.title}>Mi Perfil</Text>

                {/* Perfil */}
                <Text style={styles.label}>Nombre</Text>
                <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

                <TouchableOpacity style={styles.button} onPress={handleActualizarPerfil}>
                  <Text style={styles.buttonText}>Actualizar Perfil</Text>
                </TouchableOpacity>

                {/* Agregar nuevo vehículo */}
                <Text style={[styles.title, { marginTop: 30 }]}>Agregar Vehículo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Marca"
                  value={nMarca}
                  onChangeText={setNMarca}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Modelo"
                  value={nModelo}
                  onChangeText={setNModelo}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Matrícula"
                  value={nMatricula}
                  onChangeText={setNMatricula}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Plazas disponibles"
                  value={nPlazas}
                  onChangeText={setNPlazas}
                  keyboardType="numeric"
                />
                <TouchableOpacity style={styles.button} onPress={handleAgregarVehiculo}>
                  <Text style={styles.buttonText}>Agregar Vehículo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#EF4444", marginTop: 40 }]}
                  onPress={logout}
                >
                  <Text style={styles.buttonText}>Cerrar sesión</Text>
                </TouchableOpacity>

                <Text style={[styles.title, { marginTop: 30 }]}>Mis Vehículos</Text>
                {loadingVehiculos && (
                  <ActivityIndicator size="large" style={{ marginBottom: 12 }} />
                )}
              </>
            }
            renderItem={({ item }) =>
              editVehiculoId === item.id ? (
                <View style={styles.vehiculoContainer}>
                  <TextInput
                    style={styles.input}
                    value={editMarca}
                    onChangeText={setEditMarca}
                    placeholder="Marca"
                  />
                  <TextInput
                    style={styles.input}
                    value={editModelo}
                    onChangeText={setEditModelo}
                    placeholder="Modelo"
                  />
                  <TextInput
                    style={styles.input}
                    value={editMatricula}
                    onChangeText={setEditMatricula}
                    placeholder="Matrícula"
                  />
                  <TextInput
                    style={styles.input}
                    value={editPlazas}
                    onChangeText={setEditPlazas}
                    placeholder="Plazas disponibles"
                    keyboardType="numeric"
                  />
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <TouchableOpacity style={styles.buttonSmall} onPress={guardarEdicion}>
                      <Text style={styles.buttonText}>Guardar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.buttonSmall, { backgroundColor: "#ccc" }]}
                      onPress={cancelarEdicion}
                    >
                      <Text style={{ color: "#333" }}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.vehiculoContainer}>
                  <Text style={styles.vehiculoText}>
                    {item.marca} {item.modelo} - {item.matricula} - Plazas:{" "}
                    {item.plazasDisponibles}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      style={[styles.buttonSmall, { backgroundColor: "#3b82f6", marginRight: 10 }]}
                      onPress={() => comenzarEdicion(item)}
                    >
                      <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.buttonSmall, { backgroundColor: "#ef4444" }]}
                      onPress={() => handleEliminarVehiculo(item.id)}
                    >
                      <Text style={styles.buttonText}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            }
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  label: { fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: { color: "white", fontWeight: "600" },
  vehiculoContainer: {
    backgroundColor: "white",
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  vehiculoText: { fontSize: 16, marginBottom: 8 },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: "center",
  },
});

export default ProfileScreen;
