import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {
    initDatabase,
    getAllRoutines,
    insertRoutine,
    updateRoutineDb,
    deleteRoutineDb,
    clearFeaturedInDb,
    setFeaturedInDb,
    } from '../database/db';

    export const COMPLETED_LIMIT = 5;

    export type Routine = {
    id: string;
    name: string;
    muscleGroup: string;
    duration: number;
    createdAt: string;
    completedCount: number;
    featured: boolean;
    day: string;
    };

    type RoutineInput = Omit<Routine, 'id' | 'createdAt' | 'duration' | 'completedCount' | 'featured'> & {
    duration: string;
    };

    type RoutineContextType = {
    routines: Routine[];
    isLoading: boolean;
    addRoutine: (routine: RoutineInput) => void;
    updateRoutine: (id: string, routine: RoutineInput) => void;
    deleteRoutine: (id: string) => void;
    completeRoutine: (id: string) => void;
    resetRoutine: (id: string) => void;
    setFeaturedRoutine: (id: string) => void;
    };
    const SEED_ROUTINES: Routine[] = [
    { id: '1', name: 'Pecho y Tríceps', muscleGroup: 'Pecho', duration: 60, createdAt: new Date().toLocaleString(), completedCount: 0, featured: false, day: 'Lunes' },
    { id: '2', name: 'Espalda y Bíceps', muscleGroup: 'Espalda', duration: 50, createdAt: new Date().toLocaleString(), completedCount: 0, featured: false, day: 'Miércoles' },
    { id: '3', name: 'Pierna Completa', muscleGroup: 'Piernas', duration: 75, createdAt: new Date().toLocaleString(), completedCount: 0, featured: false, day: 'Viernes' },
    ];

    const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

    export function RoutineProvider({ children }: { children: ReactNode }) {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
        await initDatabase();
        const stored = await getAllRoutines();

        if (stored.length === 0) {
            for (const routine of SEED_ROUTINES) {
            await insertRoutine(routine);
            }
            setRoutines(SEED_ROUTINES);
        } else {
            setRoutines(stored);
        }
        setIsLoading(false);
        })();
    }, []);

    const addRoutine = async (routine: RoutineInput) => {
        const newRoutine: Routine = {
        ...routine,
        duration: Number(routine.duration),
        id: Date.now().toString(),
        createdAt: new Date().toLocaleString(),
        completedCount: 0,
        featured: false,
        };
        await insertRoutine(newRoutine);
        setRoutines((prev) => [...prev, newRoutine]);
    };

    const updateRoutine = async (id: string, updatedRoutine: RoutineInput) => {
        const current = routines.find((r) => r.id === id);
        if (!current) return;

        const newRoutine: Routine = {
        ...current,
        ...updatedRoutine,
        duration: Number(updatedRoutine.duration),
        };
        await updateRoutineDb(newRoutine);
        setRoutines((prev) => prev.map((r) => (r.id === id ? newRoutine : r)));
    };

    const deleteRoutine = async (id: string) => {
        await deleteRoutineDb(id);
        setRoutines((prev) => prev.filter((r) => r.id !== id));
    };

    const completeRoutine = async (id: string) => {
        const current = routines.find((r) => r.id === id);
        if (!current || current.completedCount >= COMPLETED_LIMIT) return;

        const newRoutine = { ...current, completedCount: current.completedCount + 1 };
        await updateRoutineDb(newRoutine);
        setRoutines((prev) => prev.map((r) => (r.id === id ? newRoutine : r)));
    };

    const resetRoutine = async (id: string) => {
        const current = routines.find((r) => r.id === id);
        if (!current) return;

        const newRoutine = { ...current, completedCount: 0 };
        await updateRoutineDb(newRoutine);
        setRoutines((prev) => prev.map((r) => (r.id === id ? newRoutine : r)));
    };

    const setFeaturedRoutine = async (id: string) => {
        await clearFeaturedInDb();
        await setFeaturedInDb(id);
        setRoutines((prev) => prev.map((r) => ({ ...r, featured: r.id === id })));
    };

    return (
        <RoutineContext.Provider
        value={{ routines, isLoading, addRoutine, updateRoutine, deleteRoutine, completeRoutine, resetRoutine, setFeaturedRoutine }}
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