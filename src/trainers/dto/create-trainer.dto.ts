import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsInt,
  IsString,
  Length,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

// Quita los espacios de los lados (si es texto)
const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

// Lo que envía el cliente en POST /api/v1/trainers
export class CreateTrainerDto {
  @Transform(trim)
  @IsString()
  @Length(9, 9) // como VARCHAR(9): 8 números y una letra
  dni: string;

  @Transform(trim)
  @IsString()
  @MinLength(1)
  @MaxLength(100) // como VARCHAR(100)
  name: string;

  @IsEmail()
  @MaxLength(150) // como VARCHAR(150)
  email: string;

  @IsArray()
  @ArrayMinSize(1) // al menos una especialidad
  @ArrayUnique() // sin repetir
  @IsInt({ each: true }) // cada elemento, un entero...
  @Min(1, { each: true }) // ...mayor que 0
  specialtyIds: number[];
}
