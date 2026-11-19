import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

// Lo que envía el cliente en POST /api/auth/register
export class RegisterDto {
  // Sin espacios y en minúsculas: "Ana@Gym.com " y "ana@gym.com" son el mismo
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(255) // como VARCHAR(255)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}
