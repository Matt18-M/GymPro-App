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

    const totalRutinas = routines.length;
    const duracionTotal = routines.reduce((acc, r) => acc + r.duration, 0);
    const duracionPromedio = totalRutinas > 0 ? Math.round(duracionTotal / totalRutinas) : 0;

    const grupoTop = (() => {
      const counts: Record<string, number> = {};
      routines.forEach((r) => {
        counts[r.muscleGroup] = (counts[r.muscleGroup] || 0) + 1;
      });
      let top = '—';
      let max = 0;
      Object.entries(counts).forEach(([group, count]) => {
        if (count > max) {
          max = count;
          top = group;
        }
      });
      return top;
    })();

    const featuredRoutine = routines.find((r) => r.featured);

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
              name={item.featured ? 'star' : isComplete ? 'trophy-outline' : 'barbell-outline'}
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
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total rutinas</Text>
              <Text style={styles.summaryValue}>{totalRutinas}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Duración total</Text>
              <Text style={styles.summaryValue}>{duracionTotal} min</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Duración promedio</Text>
              <Text style={styles.summaryValue}>{duracionPromedio} min</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Grupo top</Text>
              <Text style={styles.summaryValue}>{grupoTop}</Text>
            </View>
          </View>

          {featuredRoutine && (
            <View style={styles.featuredCard}>
              <Ionicons name="star" size={20} color={colors.background} />
              <View>
                <Text style={styles.featuredLabel}>Rutina destacada</Text>
                <Text style={styles.featuredName}>{featuredRoutine.name}</Text>
              </View>
            </View>
          )}

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
    safe: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1, padding: 16 },
    summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
    summaryCard: {
      flexBasis: '47%',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    summaryLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
    summaryValue: { color: colors.primary, fontSize: 24, fontWeight: '800', marginTop: 4 },
    featuredCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 14,
      marginBottom: 16,
    },
    featuredLabel: { color: colors.background, fontSize: 12, fontWeight: '700' },
    featuredName: { color: colors.background, fontSize: 16, fontWeight: '800' },
    list: { paddingBottom: 20 },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    cardTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
    cardSubtitle: { color: colors.primary, fontSize: 14, marginTop: 4, fontWeight: '600' },
    barBg: { height: 10, backgroundColor: colors.border, borderRadius: 5, overflow: 'hidden' },
    barFill: { height: '100%', backgroundColor: colors.primary },
    cardCount: { color: colors.textMuted, fontSize: 13, marginTop: 8 },
    empty: { color: colors.textMuted, textAlign: 'center', marginTop: 40, fontSize: 16 },
  });