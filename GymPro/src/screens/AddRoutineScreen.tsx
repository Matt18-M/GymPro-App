import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../App';
import { useRoutines } from '../context/RoutineContext';
import { MUSCLE_GROUPS, DAYS } from '../constants';
import { colors } from '../theme';

type AddRoutineRoute = RouteProp<RootStackParamList, 'AddRoutine'>;
type AddRoutineNav = NativeStackNavigationProp<RootStackParamList, 'AddRoutine'>;

export default function AddRoutineScreen() {
    const navigation = useNavigation<AddRoutineNav>();
    const route = useRoute<AddRoutineRoute>();
    const { routines, addRoutine, updateRoutine } = useRoutines();

    const [name, setName] = useState('');
    const [muscleGroup, setMuscleGroup] = useState('');
    const [day, setDay] = useState('');
    const [duration, setDuration] = useState('');

    const idToEdit = route.params?.routineId;

    useEffect(() => {
        if (idToEdit) {
            const routine = routines.find((r) => r.id === idToEdit);
        if (routine) {
            setName(routine.name);
            setMuscleGroup(routine.muscleGroup);
            setDay(routine.day);
            setDuration(String(routine.duration));
    }
    } else {
        setName('');
        setMuscleGroup('');
        setDay('');
        setDuration('');
    }
}, [idToEdit]);

    const handleSave = () => {
        if (!name.trim() || !muscleGroup || !day || !duration.trim()) {
        Alert.alert('Campos incompletos', 'Nombre, grupo muscular, día y duración son obligatorios');
        return;
        }

    const parsedDuration = parseFloat(duration);
    if (isNaN(parsedDuration)) {
        Alert.alert('Duración inválida', 'Ingresa un número válido');
        return;
    }
    if (parsedDuration < 10 || parsedDuration > 180) {
        Alert.alert('Duración fuera de rango', 'La duración debe estar entre 10 y 180 minutos');
        return;
    }

    const payload = {
        name: name.trim(),
        muscleGroup,
        day,
        duration: String(parsedDuration),
        };

    if (idToEdit) {
        updateRoutine(idToEdit, payload);
    } else {
        addRoutine(payload);
    }

    navigation.goBack();
};

return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.container}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ej: Pecho y Tríceps"
            placeholderTextColor={colors.textMuted}
            />

        <Text style={styles.label}>Grupo Muscular</Text>
        <View style={styles.chipRow}>
            {MUSCLE_GROUPS.map((group) => (
                <Pressable
                key={group}
                style={[styles.chip, muscleGroup === group && styles.chipActive]}
                onPress={() => setMuscleGroup(group)}
                >
                <Text style={[styles.chipText, muscleGroup === group && styles.chipTextActive]}>
                    {group}
                </Text>
                </Pressable>
            ))}
            </View>

            <Text style={styles.label}>Día</Text>
            <View style={styles.chipRow}>
            {DAYS.map((d) => (
                <Pressable
                key={d}
                style={[styles.chip, day === d && styles.chipActive]}
                onPress={() => setDay(d)}
                >
                <Text style={[styles.chipText, day === d && styles.chipTextActive]}>{d}</Text>
                </Pressable>
            ))}
            </View>

            <Text style={styles.label}>Duración (min)</Text>
            <TextInput
                style={styles.input}
                value={duration}
                onChangeText={setDuration}
                placeholder="Ej: 60"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                />

            <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={handleSave}
            >
                <Text style={styles.buttonText}>
                    {idToEdit ? 'Actualizar rutina' : 'Agregar rutina'}
                </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
    }

    const styles = StyleSheet.create({
        safe: { flex: 1, backgroundColor: colors.background },
        container: { flex: 1, padding: 24 },
        label: { color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 8, marginTop: 16 },
        input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: colors.text,
        fontSize: 16,
    },
        chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
        chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        },
        chipActive: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
        chipText: { color: colors.textMuted, fontWeight: '600', fontSize: 13 },
        chipTextActive: { color: colors.background },
        button: {
        backgroundColor: colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.primaryDark,
        marginTop: 32,
        alignItems: 'center',
    },
        buttonPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
        buttonText: { color: colors.background, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
    });