import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthContext } from "../auth/AuthContext";
import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ViajeScreen from "../screens/ViajeScreen";
import DetalleViajeScreen from "../screens/DetalleViajeScreen";
import BuscarScreen from "../screens/BuscarScreen";
import PublicarScreen from "../screens/PublicarScreen";
import ReservasScreen from "../screens/ReservasScreen";
import { ActivityIndicator, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const ViajeStack = createStackNavigator();

// Loading screen mientras se carga sesión
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);

// Stack para autenticación
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Stack específico para Viaje con detalle
const ViajeStackScreen = () => (
  <ViajeStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: "#344356" },
      headerTintColor: "#e2ae9c",
    }}
  >
    <ViajeStack.Screen
      name="ViajeMain"
      component={ViajeScreen}
      options={{ headerShown: false }} // Oculta header solo aquí
    />
    <ViajeStack.Screen
      name="DetalleViaje"
      component={DetalleViajeScreen}
      options={{ title: "Detalle del viaje" }} // Header visible con título
    />
  </ViajeStack.Navigator>
);

// Tabs principales cuando el usuario está logueado
const MainStack = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: { backgroundColor: "#1f2937" },
      tabBarActiveTintColor: "white",
      tabBarInactiveTintColor: "gray",
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="Viaje"
      component={ViajeStackScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="airplane" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Buscar"
      component={BuscarScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="search" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Publicar"
      component={PublicarScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="cloud-upload" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Reservas"
      component={ReservasScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="list" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="person" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

// Componente principal que decide qué stack mostrar
const Navigation = () => {
  const { loading, user } = useContext(AuthContext);

  if (loading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Navigation;
