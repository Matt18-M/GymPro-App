# GymPro 💪

Aplicación móvil para gestionar rutinas de entrenamiento, desarrollada con **React Native** y **Expo**. Permite crear, editar, filtrar y dar seguimiento a rutinas organizadas por día y grupo muscular, con persistencia local mediante **SQLite**.

## Características

- 📅 **Rutinas por día** — cada rutina se asigna a un día de la semana mediante selección, no texto libre.
- 🏋️ **Filtro por grupo muscular** — filtra la lista de rutinas reales desde el Context API.
- ✅ **Validaciones de formulario** — nombre y grupo muscular obligatorios, duración entre 10 y 180 minutos.
- ⭐ **Rutina destacada** — solo una rutina puede estar destacada a la vez, con persistencia.
- 📊 **Pantalla de inicio dinámica** — total de rutinas, duración total, promedio y grupo muscular más frecuente, calculados en tiempo real.
- 🔁 **Reinicio de progreso** — reinicia el contador de una rutina al alcanzar el límite de repeticiones.
- 💾 **Persistencia con SQLite** — los datos se conservan al cerrar y reabrir la app.

## Tecnologías

- [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Navigation](https://reactnavigation.org/) (Stack + Bottom Tabs)
- [Context API](https://react.dev/reference/react/createContext)
- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)

## Estructura del proyecto

```
GymPro/
├── App.tsx
├── assets/
│   └── gym.jpg
├── src/
│   ├── constants.ts
│   ├── theme.ts
│   ├── context/
│   │   └── RoutineContext.tsx
│   ├── database/
│   │   └── db.ts
│   ├── navigators/
│   │   └── TabNavigator.tsx
│   └── screens/
│       ├── ProgressScreen.tsx
│       ├── RoutineListScreen.tsx
│       ├── RoutineDetailScreen.tsx
│       └── AddRoutineScreen.tsx
```

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd GymPro

# Instalar dependencias
npm install

# Iniciar el proyecto
npx expo start
```

Escanea el código QR con la app **Expo Go** (Android/iOS) o ejecuta en un emulador.

## Scripts disponibles

| Comando              | Descripción                          |
|-----------------------|---------------------------------------|
| `npx expo start`      | Inicia el servidor de desarrollo      |
| `npx expo start -c`   | Inicia limpiando la caché de Metro    |
| `npx expo install`    | Instala dependencias compatibles      |



## Autor

Mateo Molina
