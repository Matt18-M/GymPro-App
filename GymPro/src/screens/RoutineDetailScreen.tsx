import { RouteProp, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../App';
import { COMPLETED_LIMIT, useRoutines } from '../context/RoutineContext';
import { colors } from '../theme';

type RoutineDetailRoute = RouteProp<RootStackParamList, 'RoutineDetail'>;

export default function RoutineDetailScreen() {
    const route = useRoute<RoutineDetailRoute>();
    const { routines, completeRoutine, setFeaturedRoutine } = useRoutines();

    const routine = routines.find((r) => r.id === route.params.id);

    if (!routine) {
      return (
        <SafeAreaView style={styles.safe} edges={['bottom']}>
          <View style={styles.container}>
            <Text style={styles.title}>Rutina no encontrada</Text>
          </View>
        </SafeAreaView>
      );
    }

    const isComplete = routine.completedCount >= COMPLETED_LIMIT;

    const handleComplete = () => {
      if (isComplete) {
        Alert.alert('Meta alcanzada', `Ya completaste esta rutina ${COMPLETED_LIMIT} veces`);
        return;
      }
      completeRoutine(routine.id);
    };

    const handleFeature = () => {
      setFeaturedRoutine(routine.id);
    };

    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.container}>
          {routine.featured && (
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={14} color={colors.background} />
              <Text style={styles.featuredBadgeText}>Rutina destacada</Text>
            </View>
          )}

          <Text style={styles.name}>{routine.name}</Text>
          <Text style={styles.muscleGroup}>{routine.muscleGroup}</Text>
          <Text style={styles.duration}>{routine.duration} mins</Text>
          <Text style={styles.createdAt}>Creada el {routine.createdAt}</Text>
          <Text style={styles.completed}>
            Completadas: {routine.completedCount} / {COMPLETED_LIMIT}
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              isComplete && styles.buttonDisabled,
              pressed && !isComplete && styles.buttonPressed,
            ]}
            onPress={handleComplete}
          >
            <Ionicons
              name={isComplete ? 'trophy-outline' : 'checkmark-circle-outline'}
              size={22}
              color={colors.background}
            />
            <Text style={styles.buttonText}>
              {isComplete ? 'Meta alcanzada' : 'Marcar como completada'}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.featureButton,
              routine.featured && styles.buttonDisabled,
              pressed && !routine.featured && styles.buttonPressed,
            ]}
            onPress={handleFeature}
            disabled={routine.featured}
          >
            <Ionicons name="star-outline" size={22} color={colors.background} />
            <Text style={styles.buttonText}>
              {routine.featured ? 'Ya es la destacada' : 'Marcar como destacada'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    featuredBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginBottom: 16,
    },
    featuredBadgeText: { color: colors.background, fontWeight: '700', fontSize: 12 },
    name: { color: colors.text, fontSize: 32, fontWeight: '800', textAlign: 'center' },
    muscleGroup: { color: colors.primary, fontSize: 22, fontWeight: '700', marginTop: 16 },
    duration: { color: colors.text, fontSize: 20, fontWeight: '600', marginTop: 12 },
    createdAt: { color: colors.textMuted, fontSize: 14, marginTop: 24 },
    completed: { color: colors.text, fontSize: 16, fontWeight: '700', marginTop: 12 },
    title: { color: colors.text, fontSize: 26, fontWeight: '700' },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 28,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.primaryDark,
      marginTop: 20,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
    },
    featureButton: { backgroundColor: colors.primaryDark },
    buttonDisabled: { opacity: 0.5 },
    buttonPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
    buttonText: { color: colors.background, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  });