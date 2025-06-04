import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";

interface Viaje {
  id: number;
  origen: string;
  destino: string;
  fechaHoraSalida: string;
  fechaHoraLlegada: string;
  plazasDisponibles: number;
  rolUsuario: "CONDUCTOR" | "PASAJERO";
}

interface Props {
  viaje: Viaje;
  onCancelar: (id: number) => void;
  onAbandonar: (id: number) => void;
  formatearFecha: (fechaIso: string) => string;
  onPress?: () => void; // <-- nuevo prop para manejar la navegación
}

const ViajeCard = ({
  viaje,
  onCancelar,
  onAbandonar,
  formatearFecha,
  onPress,
}: Props) => {
  const esConductor = viaje.rolUsuario === "CONDUCTOR";

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.viajeCard}>
        <Text style={styles.title}>
          {viaje.origen} ➡️ {viaje.destino}
        </Text>
        <Text style={styles.text}>
          Salida: {viaje.fechaHoraSalida ? formatearFecha(viaje.fechaHoraSalida) : "Sin datos"}
        </Text>
        <Text style={styles.text}>
          Llegada: {viaje.fechaHoraLlegada ? formatearFecha(viaje.fechaHoraLlegada) : "Sin datos"}
        </Text>
        <Text style={styles.text}>Plazas disponibles: {viaje.plazasDisponibles}</Text>
        <Text style={styles.rol}>{esConductor ? "Eres el conductor" : "Eres pasajero"}</Text>

        {esConductor ? (
          <PrimaryButton label="Cancelar viaje" onPress={() => onCancelar(viaje.id)} />
        ) : (
          <SecondaryButton label="Abandonar viaje" onPress={() => onAbandonar(viaje.id)} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  viajeCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#846761",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#151920",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: "#e2ae9c",
  },
  text: {
    color: "#9c9c96",
    marginBottom: 4,
  },
  rol: {
    fontStyle: "italic",
    marginBottom: 8,
    color: "#a54740",
  },
});

export default ViajeCard;
