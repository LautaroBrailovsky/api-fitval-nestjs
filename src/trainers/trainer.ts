// Una fila del JOIN entre trainers, trainer_specialties y specialties
// (sin el DNI: es un dato personal y no lo devolvemos)
export interface TrainerRow {
  id: number;
  name: string;
  email: string;
  photo_url: string | null; // null si todavía no tiene foto
  specialty: string;
}

// Un monitor con sus especialidades, como lo devuelve la API
export interface Trainer {
  id: number;
  name: string;
  email: string;
  photoUrl: string | null;
  specialties: string[];
}

// Varias filas (una por especialidad) → un solo monitor con sus especialidades
export function toTrainer(rows: TrainerRow[]): Trainer {
  return {
    id: rows[0].id, // los datos del monitor se repiten: los cogemos de la primera
    name: rows[0].name,
    email: rows[0].email,
    photoUrl: rows[0].photo_url,
    specialties: rows.map((row) => row.specialty),
  };
}
