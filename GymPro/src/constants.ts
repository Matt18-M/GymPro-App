export const MUSCLE_GROUPS = ['Pecho', 'Espalda', 'Piernas', 'Hombro', 'Brazos', 'Cardio'];

export const DAYS = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
    ];

    export function getTodayName(): string {
    const jsDay = new Date().getDay(); 
    const index = jsDay === 0 ? 6 : jsDay - 1; 
    return DAYS[index];
    }