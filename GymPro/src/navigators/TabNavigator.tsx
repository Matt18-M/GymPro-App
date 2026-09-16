import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import ProgressScreen from "../screens/ProgressScreen";
import RoutineListScreen from "../screens/RoutineListScreen";
import { colors } from "../theme";

export type TabParamList = {
  Progreso: undefined;
  Rutinas: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="Progreso"
        component={ProgressScreen}
        options={progresoOptions}
      />
      <Tab.Screen
        name="Rutinas"
        component={RoutineListScreen}
        options={rutinasOptions}
      />
    </Tab.Navigator>
  );
}

const tabScreenOptions = {
  headerStyle: {
    backgroundColor: colors.surface,
  },
  headerTintColor: colors.text,
  headerTitleStyle: {
    fontWeight: "700" as const,
  },
  tabBarStyle: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
  },
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.textMuted,
};

const progresoOptions = {
  title: "Progreso",
  tabBarIcon: ({ color, size }: { color: string; size: number }) => (
    <Ionicons 
    name="stats-chart" 
    size={size} 
    color={color} />
  ),
};

const rutinasOptions = {
  title: "Rutinas",
  tabBarIcon: ({ color, size }: { color: string; size: number }) => (
    <Ionicons 
    name="barbell" 
    size={size} 
    color={color} />
  ),
};
