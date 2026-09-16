import 'react-native-gesture-handler';

import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import DrawerNavigator from './src/navigators/DrawerNavigator';
import ChestDetailScreen from './src/screens/ChestDetailScreen';
import { colors } from './src/theme';

export type RootStackParamList = {
  DrawerRoot: undefined;
  ChestDetail: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="light" />
      <Stack.Navigator>
        <Stack.Screen
          name="DrawerRoot"
          component={DrawerNavigator}
          options={drawerRootOptions}
        />
        <Stack.Screen
          name="ChestDetail"
          component={ChestDetailScreen}
          options={chestDetailOptions}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    primary: colors.primary,
    text: colors.text,
    border: colors.border,
  },
};

const drawerRootOptions = {
  headerShown: false as const,
};

const chestDetailOptions = {
  title: 'Rutina de Pecho',
  headerStyle: {
    backgroundColor: colors.surface,
  },
  headerTintColor: colors.primary,
  headerTitleStyle: {
    fontWeight: '700' as const,
    color: colors.text,
  },
};
