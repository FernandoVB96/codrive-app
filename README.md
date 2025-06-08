# CoDrive - Aplicación Móvil de Reservas de Transporte Compartido

**Ciclo:** Desarrollo de Aplicaciones Web (DAW)  
**Autor:** Fernando Vaquero Buzon

---

## Índice

- [Introducción](#introducción)
- [Funcionalidades](#funcionalidades)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Diseño](#diseño)
- [Guía de instalación](#guía-de-instalación)
- [Guía de uso](#guía-de-uso)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Conclusión](#conclusión)
- [Contribuciones y agradecimientos](#contribuciones-y-agradecimientos)
- [Licencia](#licencia)
- [Contacto](#contacto)

---

## Introducción

CoDrive es la aplicación móvil desarrollada con React Native para facilitar la gestión de viajes compartidos, donde los usuarios pueden buscar viajes, reservar plazas, y los conductores pueden gestionar sus viajes y reservas.

---

## Funcionalidades

- Autenticación y gestión de sesión con JWT.
- Visualización y gestión de viajes propios.
- Reserva, confirmación y cancelación de plazas.
- Búsqueda de viajes disponibles.
- Gestión y visualización de reservas.
- Navegación fluida entre pantallas.

---

## Tecnologías utilizadas

- **Framework:** React Native con TypeScript y Expo.
- **Navegación:** React Navigation (Stack y Bottom Tabs).
- **Estado global:** Context API.
- **HTTP Client:** Axios para interacción con backend REST.
- **Almacenamiento:** AsyncStorage para persistencia local.
- **Estilos:** NativeWind (Tailwind CSS) y StyleSheet.
- **Iconos:** React Native Vector Icons.
- **Componentes personalizados:** Botones, tarjetas, loaders.

### Dependencias principales

```json
{
  "@react-navigation/native": "^7.1.9",
  "@react-navigation/bottom-tabs": "^7.3.13",
  "@react-navigation/native-stack": "^7.3.13",
  "@react-native-async-storage/async-storage": "^2.1.2",
  "axios": "^1.9.0",
  "expo": "^53.0.10",
  "nativewind": "^4.1.23",
  "react-native-vector-icons": "^10.2.0"
}
```

---

## Diseño

El diseño de la aplicación fue creado en Figma y puedes acceder al prototipo completo aquí:

**🎨 [Ver diseño en Figma](https://www.figma.com/design/losqRiY7lvG4qAe4tCdeYG/coDrive?node-id=0-1&t=T1V2WsuAfaeem35b-1)**

---

## Guía de instalación

1. Clona el repositorio:
```bash
git clone https://github.com/FernandoVB96/codrive-mobile.git
cd codrive-mobile
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

3. Ejecuta la app:
```bash
npm run android
# o
npm run ios
```

4. Asegúrate de tener configurado tu entorno React Native con los emuladores correspondientes.

---

## Guía de uso

1. Inicia sesión o regístrate.
2. Navega a la pantalla "Mis Viajes" para gestionar tus viajes o reservas.
3. Usa la opción "Buscar viajes" para encontrar viajes disponibles.
4. Interactúa con tarjetas de viaje para detalles y acciones.
5. Actualiza tu perfil y vehículos desde las opciones correspondientes.

---

## Estructura de carpetas

```bash
src/
├── auth/               # Contexto de autenticación y manejo de sesión
├── components/         # Componentes reutilizables (ViajeCard, ReservaCard, PrimaryButton)
├── screens/            # Pantallas principales (ViajeScreen, ReservasScreen, Login, etc.)
├── navigation/         # Configuración de navegación React Navigation
├── types/              # Tipos TypeScript
├── assets/             # Imágenes y recursos estáticos
```

---

## Conclusión

La app móvil CoDrive es una interfaz moderna y funcional que conecta usuarios con el backend, mostrando un flujo completo de interacción con viajes compartidos.

---

## Contribuciones y agradecimientos

- Gracias al profesorado y compañeros.
- Pull requests y mejoras bienvenidas.

---

## Licencia

MIT License.

---

## Contacto

**Fernando Vaquero Buzon** - fernandovaquero96@gmail.com  
**GitHub:** [FernandoVB96](https://github.com/FernandoVB96)
