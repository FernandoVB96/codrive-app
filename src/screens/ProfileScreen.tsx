import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { AuthContext } from "../auth/AuthContext";

import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import { useFocusEffect } from "@react-navigation/native";


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
  const [telefono, setTelefono] = useState(user?.telefono || "");
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

  const [showAddVehiculoForm, setShowAddVehiculoForm] = useState(false);

useFocusEffect(
  React.useCallback(() => {
    if (!user || !token) return;

    setLoadingPerfil(true);
    fetch("http://192.168.1.130:8080/usuarios/mi-perfil", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setNombre(data.nombre);
        setEmail(data.email);
        setTelefono(data.telefono || "");
        setLoadingPerfil(false);
      })
      .catch(() => {
        setLoadingPerfil(false);
        Alert.alert("Error", "No se pudo cargar perfil");
      });

    cargarVehiculos();
  }, [user, token])
);


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
    if (!token || !nombre.trim() || !email.trim() || !telefono.trim()) {
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
        telefono: telefono.trim(),
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
        conductorId: user.id,
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
        setShowAddVehiculoForm(false);
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
        conductor: { id: user.id },
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error actualizando vehículo");
        setVehiculos((old) =>
          old.map((v) =>
            v.id === editVehiculoId
              ? {
                  ...v,
                  marca: editMarca,
                  modelo: editModelo,
                  matricula: editMatricula,
                  plazasDisponibles: plazasNum,
                }
              : v
          )
        );
        setEditVehiculoId(null);
        Alert.alert("Vehículo actualizado");
      })
      .catch(() => Alert.alert("Error", "No se pudo actualizar vehículo"));
  };


  const confirmarCerrarSesion = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Cerrar sesión", style: "destructive", onPress: logout },
      ]
    );
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
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
        </View>
      </View>
      <View style={styles.header}>
        <TouchableOpacity onPress={confirmarCerrarSesion}>
          <Text style={styles.logoutText}>🔒</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
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
                <InputField
                  placeholder="Nombre"
                  value={nombre}
                  onChangeText={setNombre}
                />
                <InputField
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <InputField
                  placeholder="Teléfono"
                  value={telefono}
                  onChangeText={setTelefono}
                  keyboardType="phone-pad"
                />
                <PrimaryButton
                  label="Actualizar Perfil"
                  onPress={handleActualizarPerfil}
                />

                {/* Botón para mostrar/ocultar formulario de agregar vehículo */}
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => setShowAddVehiculoForm((prev) => !prev)}
                >
                  <Text style={styles.toggleButtonText}>
                    {showAddVehiculoForm ? "Cancelar" : "Agregar Vehículo"}
                  </Text>
                </TouchableOpacity>

                {showAddVehiculoForm && (
                  <>
                    <InputField
                      placeholder="Marca"
                      value={nMarca}
                      onChangeText={setNMarca}
                    />
                    <InputField
                      placeholder="Modelo"
                      value={nModelo}
                      onChangeText={setNModelo}
                    />
                    <InputField
                      placeholder="Matrícula"
                      value={nMatricula}
                      onChangeText={setNMatricula}
                    />
                    <InputField
                      placeholder="Plazas disponibles"
                      value={nPlazas}
                      onChangeText={setNPlazas}
                      keyboardType="numeric"
                    />
                    <PrimaryButton
                      label="Agregar Vehículo"
                      onPress={handleAgregarVehiculo}
                    />
                  </>
                )}

                <Text style={[styles.title, { marginTop: 30 }]}>Mis Vehículos</Text>
                {loadingVehiculos && (
                  <ActivityIndicator size="large" color="#e2ae9c" />
                )}
              </>
            }
            renderItem={({ item }) =>
              editVehiculoId === item.id ? (
                <View style={styles.vehiculoContainer}>
                  <InputField
                    value={editMarca}
                    onChangeText={setEditMarca}
                    placeholder="Marca"
                  />
                  <InputField
                    value={editModelo}
                    onChangeText={setEditModelo}
                    placeholder="Modelo"
                  />
                  <InputField
                    value={editMatricula}
                    onChangeText={setEditMatricula}
                    placeholder="Matrícula"
                  />
                  <InputField
                    value={editPlazas}
                    onChangeText={setEditPlazas}
                    placeholder="Plazas disponibles"
                    keyboardType="numeric"
                  />
                  <View style={styles.inlineButtons}>
                    <TouchableOpacity
                      style={[styles.smallButton, styles.cancelButton]}
                      onPress={cancelarEdicion}
                    >
                      <Text style={styles.smallButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.smallButton, styles.saveButton]}
                      onPress={guardarEdicion}
                    >
                      <Text style={styles.smallButtonText}>Guardar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.vehiculoContainer}>
                  <Text style={styles.vehiculoText}>
                    {item.marca} {item.modelo}
                  </Text>
                  <Text style={styles.vehiculoText}>Matrícula: {item.matricula}</Text>
                  <Text style={styles.vehiculoText}>
                    Plazas disponibles: {item.plazasDisponibles}
                  </Text>
                  <View style={styles.inlineButtons}>
                    <TouchableOpacity
                      style={[styles.smallButton, styles.editButton]}
                      onPress={() => comenzarEdicion(item)}
                    >
                      <Text style={styles.smallButtonText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.smallButton, styles.deleteButton]}
                      onPress={() => handleEliminarVehiculo(item.id)}
                    >
                      <Text style={styles.smallButtonText}>Eliminar</Text>
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
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
    paddingHorizontal: 10,
    backgroundColor: "#344356",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  logoutText: {
    color: "#fff",
    padding: 8,
    borderRadius: 50,
    fontSize: 10,
    fontWeight: "600",
    backgroundColor: "darkred",
    borderWidth: 1,
    borderColor: "#e2ae9c",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#e2ae9c",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  vehiculoContainer: {
    backgroundColor: "#222831",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  vehiculoText: {
    color: "#fff",
    marginBottom: 4,
  },
  inlineButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  smallButton: {
    marginLeft: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#999",
  },
  saveButton: {
    backgroundColor: "#2ecc71",
  },
  editButton: {
    backgroundColor: "#3498db",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
  },
  smallButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  toggleButton: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#e2ae9c",
    borderRadius: 8,
    alignItems: "center",
  },
  toggleButtonText: {
    fontWeight: "700",
    color: "#121212",
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

export default ProfileScreen;
