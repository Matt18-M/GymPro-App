import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../App';
import { Routine, useRoutines } from '../context/RoutineContext';
import { colors } from '../theme';

export default function RoutineListScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { routines, deleteRoutine } = useRoutines();

    const handleDelete = (id: string) => {
      Alert.alert('Eliminar rutina', '¿Estás seguro?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteRoutine(id) },
      ]);
    };

    const renderItem = ({ item }: { item: Routine }) => (
      <View style={styles.card}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>{item.muscleGroup}</Text>
          <Text style={styles.cardDuration}>{item.duration} mins</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.iconBtn}
            onPress={() => navigation.navigate('RoutineDetail', { id: item.id })}
          >
            <Ionicons name="eye-outline" size={22} color={colors.primary} />
          </Pressable>

          <Pressable
            style={styles.iconBtn}
            onPress={() => navigation.navigate('AddRoutine', { routineId: item.id })}
          >
            <Ionicons name="pencil-outline" size={22} color={colors.primary} />
          </Pressable>

          <Pressable style={styles.iconBtn} onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash-outline" size={22} color="#B3261E" />
          </Pressable>
        </View>
      </View>
    );

    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.container}>
          <FlatList
            data={routines}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.empty}>No hay rutinas todavía</Text>}
          />

          <Pressable
            style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
            onPress={() => navigation.navigate('AddRoutine', {})}
          >
            <Ionicons name="add-circle-outline" size={22} color={colors.background} />
            <Text style={styles.fabText}>Nueva Rutina</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      padding: 16,
    },
    list: {
      paddingBottom: 100,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardInfo: {
      flex: 1,
    },
    cardTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '700',
    },
    cardSubtitle: {
      color: colors.primary,
      fontSize: 14,
      marginTop: 4,
      fontWeight: '600',
    },
    cardDuration: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 4,
    },
    actions: {
      flexDirection: 'row',
      gap: 4,
    },
    iconBtn: {
      padding: 8,
    },
    empty: {
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: 40,
      fontSize: 16,
    },
    fab: {
      position: 'absolute',
      bottom: 24,
      left: 16,
      right: 16,
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.primaryDark,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
    },
    fabPressed: {
      opacity: 0.85,
      transform: [{ scale: 0.98 }],
    },
    fabText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
  });