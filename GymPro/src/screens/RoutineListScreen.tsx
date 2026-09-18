import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../App';
import { Routine, useRoutines } from '../context/RoutineContext';
import { colors } from '../theme';

export default function RoutineListScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { routines, addRoutine, updateRoutine, deleteRoutine } = useRoutines();

  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [duration, setDuration] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setMuscleGroup('');
    setDuration('');
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!name.trim() || !muscleGroup.trim() || !duration.trim()) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos');
      return;
    }

    const parsed = Number(duration);
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert('Duración inválida', 'Ingresa un número mayor a 0');
      return;
    }

    const payload = {
      name: name.trim(),
      muscleGroup: muscleGroup.trim(),
      duration,
    };

    if (editingId) {
      updateRoutine(editingId, payload);
    } else {
      addRoutine(payload);
    }

    resetForm();
  };

  const handleEdit = (routine: Routine) => {
    setName(routine.name);
    setMuscleGroup(routine.muscleGroup);
    setDuration(String(routine.duration));
    setEditingId(routine.id);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Eliminar rutina', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteRoutine(id) },
    ]);
  };

  const onPressChest = () => {
    navigation.navigate('ChestDetail');
  };

  const renderItem = ({ item }: { item: Routine }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>{item.muscleGroup} · {item.duration} min</Text>
        <Text style={styles.cardDate}>{item.createdAt}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={[styles.actionBtn, styles.editBtn]} onPress={() => handleEdit(item)}>
          <Ionicons name="create-outline" size={18} color={colors.background} />
          <Text style={styles.actionText}>Editar</Text>
        </Pressable>

        <Pressable style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={18} color={colors.background} />
          <Text style={styles.actionText}>Borrar</Text>
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
          ListHeaderComponent={
            <View style={styles.form}>
              <Text style={styles.formTitle}>{editingId ? 'Editar rutina' : 'Nueva rutina'}</Text>

              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nombre (ej: Pecho y Tríceps)"
                placeholderTextColor={colors.textMuted}
              />

              <TextInput
                style={styles.input}
                value={muscleGroup}
                onChangeText={setMuscleGroup}
                placeholder="Grupo muscular (ej: Pecho)"
                placeholderTextColor={colors.textMuted}
              />

              <TextInput
                style={styles.input}
                value={duration}
                onChangeText={setDuration}
                placeholder="Duración en minutos (ej: 60)"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
              />

              <Pressable
                style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                onPress={handleSubmit}
              >
                <Ionicons name={editingId ? 'save-outline' : 'add-circle-outline'} size={20} color={colors.background} />
                <Text style={styles.buttonText}>{editingId ? 'Guardar cambios' : 'Agregar rutina'}</Text>
              </Pressable>

              {editingId && (
                <Pressable
                  style={({ pressed }) => [styles.button, styles.cancelBtn, pressed && styles.buttonPressed]}
                  onPress={resetForm}
                >
                  <Ionicons name="close-circle-outline" size={20} color={colors.background} />
                  <Text style={styles.buttonText}>Cancelar</Text>
                </Pressable>
              )}
            </View>
          }
          ListEmptyComponent={<Text style={styles.empty}>No hay rutinas todavía</Text>}
        />

        <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={onPressChest}>
          <Ionicons name="eye-outline" size={20} color={colors.background} />
          <Text style={styles.buttonText}>Ver Rutina de Pecho</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => Alert.alert('Rutina de Pecho')}
        >
          <Ionicons name="play-circle-outline" size={20} color={colors.background} />
          <Text style={styles.buttonText}>Comenzar Rutina</Text>
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
    paddingBottom: 16,
  },
  form: {
    marginBottom: 20,
  },
  formTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 16,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardInfo: {
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
  cardDate: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 6,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  editBtn: {
    backgroundColor: colors.primary,
  },
  deleteBtn: {
    backgroundColor: '#B3261E',
  },
  actionText: {
    color: colors.background,
    fontWeight: '700',
    fontSize: 14,
  },
  empty: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primaryDark,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  cancelBtn: {
    backgroundColor: colors.textMuted,
    borderColor: colors.border,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});