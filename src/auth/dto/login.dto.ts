import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

// Lo que envía el cliente en POST /api/auth/login
export class LoginDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
