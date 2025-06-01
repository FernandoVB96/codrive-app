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

  const [nombre, setNombre] = useState(user?.nombre || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loadingPerfil, setLoadingPerfil] = useState(false);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loadingVehiculos, setLoadingVehiculos] = useState(false);

  const [nMarca, setNMarca] = useState("");
  const [nModelo, setNModelo] = useState("");
  const [nMatricula, setNMatricula] = useState("");
  const [nPlazas, setNPlazas] = useState("");

  const [editVehiculoId, setEditVehiculoId] = useState<number | null>(null);
  const [editMarca, setEditMarca] = useState("");
  const [editModelo, setEditModelo] = useState("");
  const [editMatricula, setEditMatricula] = useState("");
  const [editPlazas, setEditPlazas] = useState("");

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

  const handleActualizarPerfil = () => {
    if (!token || !nombre.trim() || !email.trim()) {
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
        password: "",
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
        setUser(data);
        Alert.alert("Perfil actualizado");
      })
      .catch((e) => Alert.alert("Error", e.message));
  };

  const handleAgregarVehiculo = () => {
    if (!token || !user) return;
    if (!nMarca || !nModelo || !nMatricula || !nPlazas) {
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
        marca: nMarca,
        modelo: nModelo,
        matricula: nMatricula,
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
        setVehiculos((prev) => [...prev, nuevoVehiculo]);
        setNMarca("");
        setNModelo("");
        setNMatricula("");
        setNPlazas("");
        Alert.alert("Vehículo agregado");
      })
      .catch((e) => Alert.alert("Error", e.message));
  };

  const handleEliminarVehiculo = (id: number) => {
    Alert.alert("Confirmar", "¿Seguro que quieres eliminar este vehículo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          fetch(`http://192.168.1.130:8080/vehiculos/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => {
              if (!res.ok) throw new Error("Error eliminando vehículo");
              setVehiculos((prev) => prev.filter((v) => v.id !== id));
              Alert.alert("Vehículo eliminado");
            })
            .catch(() => Alert.alert("Error", "No se pudo eliminar vehículo"));
        },
      },
    ]);
  };

  const comenzarEdicion = (vehiculo: Vehiculo) => {
    setEditVehiculoId(vehiculo.id);
    setEditMarca(vehiculo.marca);
    setEditModelo(vehiculo.modelo);
    setEditMatricula(vehiculo.matricula);
    setEditPlazas(String(vehiculo.plazasDisponibles));
  };

  const cancelarEdicion = () => setEditVehiculoId(null);

  const guardarEdicion = () => {
    if (!token || editVehiculoId === null) return;
    if (!editMarca || !editModelo || !editMatricula || !editPlazas) {
      Alert.alert("Completa todos los campos");
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
        marca: editMarca,
        modelo: editModelo,
        matricula: editMatricula,
        plazasDisponibles: plazasNum,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error actualizando vehículo");
        setVehiculos((old) =>
          old.map((v) =>
            v.id === editVehiculoId
              ? { ...v, marca: editMarca, modelo: editModelo, matricula: editMatricula, plazasDisponibles: plazasNum }
              : v
          )
        );
        setEditVehiculoId(null);
        Alert.alert("Vehículo actualizado");
      })
      .catch(() => Alert.alert("Error", "No se pudo actualizar vehículo"));
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "white" }}>Cargando usuario...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        {loadingPerfil ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#e2ae9c" />
          </View>
        ) : (
          <FlatList
            data={vehiculos}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 20 }}
            ListHeaderComponent={
              <>
                <Text style={styles.title}>Mi Perfil</Text>
                <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Nombre" placeholderTextColor="#9c9c96" />
                <TouchableOpacity style={styles.button} onPress={handleActualizarPerfil}>
                  <Text style={styles.buttonText}>Actualizar Perfil</Text>
                </TouchableOpacity>

                <Text style={[styles.title, { marginTop: 30 }]}>Agregar Vehículo</Text>
                <TextInput style={styles.input} placeholder="Marca" value={nMarca} onChangeText={setNMarca} placeholderTextColor="#9c9c96" />
                <TextInput style={styles.input} placeholder="Modelo" value={nModelo} onChangeText={setNModelo} placeholderTextColor="#9c9c96" />
                <TextInput style={styles.input} placeholder="Matrícula" value={nMatricula} onChangeText={setNMatricula} placeholderTextColor="#9c9c96" />
                <TextInput style={styles.input} placeholder="Plazas disponibles" value={nPlazas} onChangeText={setNPlazas} keyboardType="numeric" placeholderTextColor="#9c9c96" />
                <TouchableOpacity style={styles.button} onPress={handleAgregarVehiculo}>
                  <Text style={styles.buttonText}>Agregar Vehículo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                  <Text style={styles.buttonText}>Cerrar sesión</Text>
                </TouchableOpacity>

                <Text style={[styles.title, { marginTop: 30 }]}>Mis Vehículos</Text>
                {loadingVehiculos && <ActivityIndicator size="large" color="#e2ae9c" />}
              </>
            }
            renderItem={({ item }) =>
              editVehiculoId === item.id ? (
                <View style={styles.vehiculoCard}>
                  <TextInput style={styles.input} value={editMarca} onChangeText={setEditMarca} placeholder="Marca" placeholderTextColor="#9c9c96" />
                  <TextInput style={styles.input} value={editModelo} onChangeText={setEditModelo} placeholder="Modelo" placeholderTextColor="#9c9c96" />
                  <TextInput style={styles.input} value={editMatricula} onChangeText={setEditMatricula} placeholder="Matrícula" placeholderTextColor="#9c9c96" />
                  <TextInput style={styles.input} value={editPlazas} onChangeText={setEditPlazas} placeholder="Plazas disponibles" keyboardType="numeric" placeholderTextColor="#9c9c96" />
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <TouchableOpacity style={styles.smallButton} onPress={guardarEdicion}>
                      <Text style={styles.buttonText}>Guardar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.smallButton, { backgroundColor: "#9c9c96" }]} onPress={cancelarEdicion}>
                      <Text style={{ color: "#333" }}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.vehiculoCard}>
                  <Text style={styles.vehiculoText}>{item.marca} {item.modelo} - {item.matricula} - Plazas: {item.plazasDisponibles}</Text>
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity style={[styles.smallButton, { backgroundColor: "#3b82f6", marginRight: 10 }]} onPress={() => comenzarEdicion(item)}>
                      <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.smallButton, { backgroundColor: "#ef4444" }]} onPress={() => handleEliminarVehiculo(item.id)}>
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
  container: { flex: 1, backgroundColor: "#344356" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "#e2ae9c", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#9c9c96",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    backgroundColor: "#151920",
    color: "white",
  },
  button: {
    backgroundColor: "#d6765e",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: { color: "white", fontWeight: "600" },
  vehiculoCard: {
    backgroundColor: "#151920",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    borderColor: "#9c9c96",
    borderWidth: 1,
  },
  vehiculoText: { fontSize: 16, color: "#ffffff", marginBottom: 8 },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: "center",
  },
});

export default ProfileScreen;
