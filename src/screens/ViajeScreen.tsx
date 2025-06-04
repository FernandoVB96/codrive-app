import React, { useState, useContext, useCallback } from "react";
import {
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  View,
} from "react-native";
import { AuthContext } from "../auth/AuthContext";
import {
  useFocusEffect,
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import ViajeCard from "../components/ViajeCard";
import { RootStackParamList } from "../types/navigation";
import PrimaryButton from "../components/PrimaryButton";

type Viaje = {
  id: number;
  origen: string;
  destino: string;
  fechaHoraSalida: string;
  fechaHoraLlegada: string;
  plazasDisponibles: number;
  rolUsuario: "CONDUCTOR" | "PASAJERO";
};

type ViajeScreenNavigationProp = NavigationProp<RootStackParamList, "Viaje">;

const ViajeScreen = () => {
  const { token } = useContext(AuthContext);
  const navigation = useNavigation<ViajeScreenNavigationProp>();
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMisViajes = async () => {
    try {
      const response = await fetch("http://192.168.1.130:8080/viajes/mis-viajes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("No se pudieron obtener los viajes");
      const data: Viaje[] = await response.json();
      setViajes(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error al obtener tus viajes");
    } finally {
      setLoading(false);
    }
  };

  const cancelarViaje = async (viajeId: number) => {
    try {
      const response = await fetch(`http://192.168.1.130:8080/viajes/${viajeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al cancelar el viaje");
      Alert.alert("Viaje cancelado");
      fetchMisViajes();
    } catch (error) {
      console.error(error);
      Alert.alert("No se pudo cancelar el viaje");
    }
  };

  const abandonarViaje = async (viajeId: number) => {
    try {
      const response = await fetch(`http://192.168.1.130:8080/viajes/${viajeId}/abandonar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al abandonar el viaje");
      Alert.alert("Has abandonado el viaje");
      fetchMisViajes();
    } catch (error) {
      console.error(error);
      Alert.alert("No se pudo abandonar el viaje");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMisViajes();
    }, [])
  );

  const formatearFecha = (fechaIso: string) => {
    const fecha = new Date(fechaIso);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = String(fecha.getFullYear()).slice(-2);
    const hora = fecha.getHours();
    const minutos = String(fecha.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${anio} ${hora}:${minutos}h`;
  };

  const renderViaje = ({ item }: { item: Viaje }) => (
    <ViajeCard
      viaje={item}
      onCancelar={cancelarViaje}
      onAbandonar={abandonarViaje}
      formatearFecha={formatearFecha}
      onPress={() => navigation.navigate("DetalleViaje", { viajeId: item.id })}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#344356" />

      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
        </View>
      </View>

      <Text style={styles.header}>Mis viajes</Text>

      <PrimaryButton
        label="Buscar viajes"
        onPress={() => navigation.navigate("Buscar")}
        backgroundColor="#d6765e"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#d6765e" />
      ) : (
        <FlatList
          data={viajes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderViaje}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No estás en ningún viaje aún.
            </Text>
          }
        />
      )}
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 80,
    marginBottom: 16,
    textAlign: "center",
    color: "#e2ae9c",
  },
  emptyText: {
    color: "#e2ae9c",
    textAlign: "center",
    marginTop: 20,
  },
});

export default ViajeScreen;
