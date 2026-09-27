import 'react-native-gesture-handler';

import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Image, View } from 'react-native';
import TabNavigator from './src/navigators/TabNavigator';
import RoutineDetailScreen from './src/screens/RoutineDetailScreen';
import AddRoutineScreen from './src/screens/AddRoutineScreen';
import { RoutineProvider, useRoutines } from './src/context/RoutineContext';
import { colors } from './src/theme';

export type RootStackParamList = {
    TabRoot: undefined;
    RoutineDetail: { id: string };
    AddRoutine: { routineId?: string };
  };

  const Stack = createNativeStackNavigator<RootStackParamList>();

  function RootNavigator() {
    const { isLoading } = useRoutines();

    if (isLoading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    return (
      <NavigationContainer theme={navTheme}>
        <StatusBar style="light" />
        <Stack.Navigator>
          <Stack.Screen name="TabRoot" component={TabNavigator} options={tabRootOptions} />
          <Stack.Screen name="RoutineDetail" component={RoutineDetailScreen} options={routineDetailOptions} />
          <Stack.Screen name="AddRoutine" component={AddRoutineScreen} options={addRoutineOptions} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  export default function App() {
    return (
      <RoutineProvider>
        <RootNavigator />
      </RoutineProvider>
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

  const tabRootOptions = {
    headerShown: true as const,
    headerTitle: () => (
      <Image
        source={require('./assets/gym.jpg')}
        style={{ width: 120, height: 36, resizeMode: 'contain' as const, borderRadius: 6 }}
      />
    ),
  };

  const routineDetailOptions = {
    title: 'Detalle de Rutina',
    headerStyle: { backgroundColor: colors.surface },
    headerTintColor: colors.primary,
    headerTitleStyle: { fontWeight: '700' as const, color: colors.text },
  };

  const addRoutineOptions = {
    title: 'Rutina',
    headerStyle: { backgroundColor: colors.surface },
    headerTintColor: colors.primary,
    headerTitleStyle: { fontWeight: '700' as const, color: colors.text },
  };