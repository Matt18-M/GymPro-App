import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../App';
import { COMPLETED_LIMIT, Routine, useRoutines } from '../context/RoutineContext';
import { DAYS, getTodayName } from '../constants';
import { colors } from '../theme';

const SUMMARY_ICONS = {
  total: 'barbell' as const,
  duration: 'time' as const,
  average: 'speedometer' as const,
  top: 'trophy' as const,
};

export default function ProgressScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { routines } = useRoutines();
    const [selectedDay, setSelectedDay] = useState(getTodayName());

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
    const dayRoutines = routines.filter((r) => r.day === selectedDay);
    const isToday = selectedDay === getTodayName();

    const today = new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

    const renderItem = ({ item }: { item: Routine }) => {
      const progress = Math.min(item.completedCount / COMPLETED_LIMIT, 1);
      const isComplete = item.completedCount >= COMPLETED_LIMIT;

      return (
        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => navigation.navigate('RoutineDetail', { id: item.id })}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
              <View style={styles.cardTagRow}>
                <View style={styles.cardTag}>
                  <Text style={styles.cardTagText}>{item.muscleGroup}</Text>
                </View>
                <Text style={styles.cardDay}>{item.duration} min</Text>
              </View>
            </View>
            <View style={styles.cardIconWrap}>
              <Ionicons
                name={item.featured ? 'star' : isComplete ? 'trophy-outline' : 'barbell-outline'}
                size={20}
                color={colors.primary}
              />
            </View>
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
        <FlatList
          data={dayRoutines}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View>
              <View style={styles.hero}>
                <Text style={styles.heroDate}>{today}</Text>
                <Text style={styles.heroTitle}>Rutina del día</Text>
              </View>

              <View style={styles.dayRow}>
                {DAYS.map((d) => (
                  <Pressable
                    key={d}
                    style={[styles.dayChip, selectedDay === d && styles.dayChipActive]}
                    onPress={() => setSelectedDay(d)}
                  >
                    <Text style={[styles.dayChipText, selectedDay === d && styles.dayChipTextActive]}>
                      {d.slice(0, 3)}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.sectionTitle}>
                {isToday ? 'Hoy' : selectedDay} · {dayRoutines.length} rutina{dayRoutines.length === 1 ? '' : 's'}
              </Text>

              <View style={styles.summaryGrid}>
                <View style={styles.summaryCard}>
                  <Ionicons name={SUMMARY_ICONS.total} size={18} color={colors.primary} />
                  <Text style={styles.summaryValue}>{totalRutinas}</Text>
                  <Text style={styles.summaryLabel}>Rutinas</Text>
                </View>
                <View style={styles.summaryCard}>
                  <Ionicons name={SUMMARY_ICONS.duration} size={18} color={colors.primary} />
                  <Text style={styles.summaryValue}>{duracionTotal}</Text>
                  <Text style={styles.summaryLabel}>Min totales</Text>
                </View>
                <View style={styles.summaryCard}>
                  <Ionicons name={SUMMARY_ICONS.average} size={18} color={colors.primary} />
                  <Text style={styles.summaryValue}>{duracionPromedio}</Text>
                  <Text style={styles.summaryLabel}>Min promedio</Text>
                </View>
                <View style={styles.summaryCard}>
                  <Ionicons name={SUMMARY_ICONS.top} size={18} color={colors.primary} />
                  <Text style={styles.summaryValue} numberOfLines={1}>{grupoTop}</Text>
                  <Text style={styles.summaryLabel}>Grupo top</Text>
                </View>
              </View>

              {featuredRoutine && (
                <Pressable
                  style={({ pressed }) => [styles.featuredCard, pressed && styles.cardPressed]}
                  onPress={() => navigation.navigate('RoutineDetail', { id: featuredRoutine.id })}
                >
                  <View style={styles.featuredIconWrap}>
                    <Ionicons name="star" size={22} color={colors.background} />
                  </View>
                  <View style={styles.featuredTextWrap}>
                    <Text style={styles.featuredLabel}>RUTINA DESTACADA</Text>
                    <Text style={styles.featuredName}>{featuredRoutine.name}</Text>
                    <Text style={styles.featuredMeta}>
                      {featuredRoutine.muscleGroup} · {featuredRoutine.day}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.background} />
                </Pressable>
              )}
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="calendar-outline" size={36} color={colors.textMuted} />
              <Text style={styles.empty}>No hay rutinas asignadas a {selectedDay}</Text>
            </View>
          }
        />
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    list: { padding: 16, paddingBottom: 40 },

    hero: { marginBottom: 16 },
    heroDate: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    heroTitle: {
      color: colors.text,
      fontSize: 30,
      fontWeight: '800',
      marginTop: 4,
    },

    dayRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
    dayChip: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 8,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    dayChipActive: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
    dayChipText: { color: colors.textMuted, fontWeight: '700', fontSize: 12 },
    dayChipTextActive: { color: colors.background },

    sectionTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '800',
      marginBottom: 12,
    },

    summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
    summaryCard: {
      flexBasis: '47%',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    summaryValue: { color: colors.text, fontSize: 22, fontWeight: '800', marginTop: 8 },
    summaryLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '600', marginTop: 2 },

    featuredCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.primary,
      borderRadius: 16,
      padding: 14,
      marginBottom: 8,
    },
    featuredIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.primaryDark,
      alignItems: 'center',
      justifyContent: 'center',
    },
    featuredTextWrap: { flex: 1 },
    featuredLabel: { color: colors.background, fontSize: 11, fontWeight: '800', letterSpacing: 0.5, opacity: 0.85 },
    featuredName: { color: colors.background, fontSize: 17, fontWeight: '800', marginTop: 2 },
    featuredMeta: { color: colors.background, fontSize: 12, marginTop: 2, opacity: 0.85 },

    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    cardHeaderText: { flex: 1, paddingRight: 8 },
    cardTitle: { color: colors.text, fontSize: 17, fontWeight: '700' },
    cardTagRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
    cardTag: {
      backgroundColor: colors.background,
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardTagText: { color: colors.primary, fontSize: 11, fontWeight: '700' },
    cardDay: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
    cardIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    barBg: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
    barFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
    cardCount: { color: colors.textMuted, fontSize: 12, marginTop: 8, fontWeight: '600' },

    emptyWrap: { alignItems: 'center', marginTop: 40, gap: 10 },
    empty: { color: colors.textMuted, textAlign: 'center', fontSize: 15 },
  });