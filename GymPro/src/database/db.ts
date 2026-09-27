import * as SQLite from 'expo-sqlite';
import { Routine } from '../context/RoutineContext';

const DB_NAME = 'gympro.db';
let db: SQLite.SQLiteDatabase | null = null;

async function getDatabase() {
    if (!db) {
        db = await SQLite.openDatabaseAsync(DB_NAME);
    }
    return db;
    }

    export async function initDatabase() {
    const database = await getDatabase();
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS routines (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        muscleGroup TEXT NOT NULL,
        duration INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        completedCount INTEGER NOT NULL DEFAULT 0,
        featured INTEGER NOT NULL DEFAULT 0,
        day TEXT NOT NULL DEFAULT 'Lunes'
        );
    `);

    try {
        await database.execAsync(`ALTER TABLE routines ADD COLUMN day TEXT NOT NULL DEFAULT 'Lunes';`);
    } catch (e) {
    }
    }

    function rowToRoutine(row: any): Routine {
    return {
        id: row.id,
        name: row.name,
        muscleGroup: row.muscleGroup,
        duration: row.duration,
        createdAt: row.createdAt,
        completedCount: row.completedCount,
        featured: !!row.featured,
        day: row.day ?? 'Lunes',
    };
    }

    export async function getAllRoutines(): Promise<Routine[]> {
    const database = await getDatabase();
    const rows = await database.getAllAsync<any>('SELECT * FROM routines ORDER BY createdAt DESC;');
    return rows.map(rowToRoutine);
    }

    export async function insertRoutine(routine: Routine) {
    const database = await getDatabase();
    await database.runAsync(
        `INSERT INTO routines (id, name, muscleGroup, duration, createdAt, completedCount, featured, day)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        routine.id,
        routine.name,
        routine.muscleGroup,
        routine.duration,
        routine.createdAt,
        routine.completedCount,
        routine.featured ? 1 : 0,
        routine.day
    );
    }

    export async function updateRoutineDb(routine: Routine) {
    const database = await getDatabase();
    await database.runAsync(
        `UPDATE routines SET name = ?, muscleGroup = ?, duration = ?, completedCount = ?, featured = ?, day = ?
        WHERE id = ?;`,
        routine.name,
        routine.muscleGroup,
        routine.duration,
        routine.completedCount,
        routine.featured ? 1 : 0,
        routine.day,
        routine.id
    );
    }

    export async function deleteRoutineDb(id: string) {
    const database = await getDatabase();
    await database.runAsync('DELETE FROM routines WHERE id = ?;', id);
    }

    export async function clearFeaturedInDb() {
    const database = await getDatabase();
    await database.runAsync('UPDATE routines SET featured = 0;');
    }

    export async function setFeaturedInDb(id: string) {
    const database = await getDatabase();
    await database.runAsync('UPDATE routines SET featured = 1 WHERE id = ?;', id);
    }