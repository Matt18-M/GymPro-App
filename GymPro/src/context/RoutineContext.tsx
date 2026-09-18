import React, { createContext, useState, ReactNode } from 'react';

export const COMPLETED_LIMIT = 5;

    export type Routine = {
    id: string;
    name: string;
    muscleGroup: string;
    duration: number;
    createdAt: string;
    completedCount: number;
    };

    type RoutineInput = Omit<Routine, 'id' | 'createdAt' | 'duration' | 'completedCount'> & {
    duration: string;
    };

    type RoutineContextType = {
    routines: Routine[];
    addRoutine: (routine: RoutineInput) => void;
    updateRoutine: (id: string, routine: RoutineInput) => void;
    deleteRoutine: (id: string) => void;
    completeRoutine: (id: string) => void;
    };

    const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

    export function RoutineProvider({ children }: { children: ReactNode }) {
    const [routines, setRoutines] = useState<Routine[]>([
        {
        id: '1',
        name: 'Pecho y Tríceps',
        muscleGroup: 'Pecho',
        duration: 60,
        createdAt: new Date().toLocaleString(),
        completedCount: 0,
        },
        {
        id: '2',
        name: 'Espalda y Bíceps',
        muscleGroup: 'Espalda',
        duration: 50,
        createdAt: new Date().toLocaleString(),
        completedCount: 0,
        },
        {
        id: '3',
        name: 'Pierna Completa',
        muscleGroup: 'Piernas',
        duration: 75,
        createdAt: new Date().toLocaleString(),
        completedCount: 0,
        },
    ]);

    const addRoutine = (routine: RoutineInput) => {
        const newRoutine: Routine = {
        ...routine,
        duration: Number(routine.duration),
        id: Date.now().toString(),
        createdAt: new Date().toLocaleString(),
        completedCount: 0,
        };

        setRoutines([...routines, newRoutine]);
    };

    const updateRoutine = (id: string, updatedRoutine: RoutineInput) => {
        setRoutines(
        routines.map((r) =>
            r.id === id
            ? {
                ...r,
                ...updatedRoutine,
                duration: Number(updatedRoutine.duration),
                }
            : r
        )
        );
    };

    const deleteRoutine = (id: string) => {
        setRoutines(routines.filter((r) => r.id !== id));
    };

    const completeRoutine = (id: string) => {
        setRoutines(
        routines.map((r) =>
            r.id === id && r.completedCount < COMPLETED_LIMIT
            ? { ...r, completedCount: r.completedCount + 1 } : r
            )
        );
    };

    return (
        <RoutineContext.Provider
            value={{ routines, addRoutine, updateRoutine, deleteRoutine, completeRoutine }}
        >
            {children}
        </RoutineContext.Provider>
);
}

export function useRoutines() {
    const context = React.useContext(RoutineContext);
    if (!context) {
    throw new Error('useRoutines debe ser usado dentro de un RoutineProvider');
}
    return context;
}