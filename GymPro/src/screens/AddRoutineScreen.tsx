import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../App';
import { useRoutines } from '../context/RoutineContext';
import { colors } from '../theme';

type AddRoutineRoute = RouteProp<RootStackParamList, 'AddRoutine'>;
type AddRoutineNav = NativeStackNavigationProp<RootStackParamList, 'AddRoutine'>;

export default function AddRoutineScreen() {
    const navigation = useNavigation<AddRoutineNav>();
    const route = useRoute<AddRoutineRoute>();
    const { routines, addRoutine, updateRoutine } = useRoutines();

    const [name, setName] = useState('');
    const [muscleGroup, setMuscleGroup] = useState('');
    const [duration, setDuration] = useState('');

    const idToEdit = route.params?.routineId;

    useEffect(() => {
        if (idToEdit) {
            const routine = routines.find((r) => r.id === idToEdit);
        if (routine) {
            setName(routine.name);
            setMuscleGroup(routine.muscleGroup);
            setDuration(String(routine.duration));
    }
    } else {
        setName('');
        setMuscleGroup('');
        setDuration('');
    }
}, [idToEdit]);

    const handleSave = () => {
        if (!name.trim() || !muscleGroup.trim() || !duration.trim()) {
        Alert.alert('Campos incompletos', 'Por favor completa todos los campos');
        return;
        }

    const parsedDuration = parseFloat(duration);
    if (isNaN(parsedDuration) || parsedDuration <= 0) {
        Alert.alert('Duración inválida', 'Ingresa un número mayor a 0');
        return;
        }

    const payload = {
        name: name.trim(),
        muscleGroup: muscleGroup.trim(),
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
        <TextInput
            style={styles.input}
            value={muscleGroup}
            onChangeText={setMuscleGroup}
            placeholder="Ej: Pecho"
            placeholderTextColor={colors.textMuted}
                />

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
    safe: {
    flex: 1,
    backgroundColor: colors.background,
},
    container: {
    flex: 1,
    padding: 24,
},
    label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 16,
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
},
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