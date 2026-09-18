import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../App';
import { COMPLETED_LIMIT, Routine, useRoutines } from '../context/RoutineContext';
import { colors } from '../theme';

export default function ProgressScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { routines } = useRoutines();

    const totalCompletadas = routines.reduce((acc, r) => acc + r.completedCount, 0);

    const renderItem = ({ item }: { item: Routine }) => {
      const progress = Math.min(item.completedCount / COMPLETED_LIMIT, 1);
      const isComplete = item.completedCount >= COMPLETED_LIMIT;

      return (
        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => navigation.navigate('RoutineDetail', { id: item.id })}
        >
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>{item.muscleGroup}</Text>
            </View>
            <Ionicons
              name={isComplete ? 'trophy-outline' : 'barbell-outline'}
              size={24}
              color={colors.primary}
            />
          </View>

          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
          </View>

          <Text style={styles.cardCount}>
            {item.completedCount} / {COMPLETED_LIMIT} completadas
            {isComplete ? ' · ¡Meta alcanzada!' : ''}
          </Text>
        </Pressable>
      );
    };

    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.container}>
          <Text style={styles.totalTitle}>Total completadas</Text>
          <Text style={styles.totalNumber}>{totalCompletadas}</Text>

          <FlatList
            data={routines}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.empty}>No hay rutinas todavía</Text>}
          />
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
    totalTitle: {
      color: colors.textMuted,
      fontSize: 14,
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    totalNumber: {
      color: colors.primary,
      fontSize: 42,
      fontWeight: '800',
      marginBottom: 20,
    },
    list: {
      paddingBottom: 20,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardPressed: {
      opacity: 0.85,
      transform: [{ scale: 0.98 }],
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
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
    barBg: {
      height: 10,
      backgroundColor: colors.border,
      borderRadius: 5,
      overflow: 'hidden',
    },
    barFill: {
      height: '100%',
      backgroundColor: colors.primary,
    },
    cardCount: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 8,
    },
    empty: {
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: 40,
      fontSize: 16,
    },
  });