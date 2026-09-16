import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import SettingsScreen from '../screens/SettingsScreen';
import TabNavigator from './TabNavigator';
import { colors } from '../theme';

export type DrawerParamList = {
  MiEntrenamiento: undefined;
  Configuracion: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator screenOptions={drawerScreenOptions}>
      <Drawer.Screen
        name="MiEntrenamiento"
        component={TabNavigator}
        options={miEntrenamientoOptions}
      />
      <Drawer.Screen
        name="Configuracion"
        component={SettingsScreen}
        options={configuracionOptions}
      />
    </Drawer.Navigator>
  );
}

const drawerScreenOptions = {
  drawerStyle: {
    backgroundColor: colors.surface,
  },
  drawerActiveTintColor: colors.primary,
  drawerInactiveTintColor: colors.textMuted,
  headerStyle: {
    backgroundColor: colors.surface,
  },
  headerTintColor: colors.text,
  headerTitleStyle: {
    fontWeight: '700' as const,
  },
};

const miEntrenamientoOptions = {
  title: 'Mi Entrenamiento',
  drawerIcon: ({ color, size }: { color: string; size: number }) => (
    <Ionicons 
    name="fitness" 
    size={size} 
    color={color} />
  ),
};

const configuracionOptions = {
  title: 'Configuración',
  drawerIcon: ({ color, size }: { color: string; size: number }) => (
    <Ionicons 
    name="settings-sharp" 
    size={size} 
    color={color} />
  ),
};
