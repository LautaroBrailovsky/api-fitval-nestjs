import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/all-exceptions.filter';

// La configuración de la app, en un solo sitio.
// La usan main.ts y los tests, para que todos funcionen igual.
export function configureApp(app: INestApplication) {
  // Todas las rutas empiezan por /api
  app.setGlobalPrefix('api');

  // Versiones en la URL: /api/v1/..., /api/v2/...
  app.enableVersioning({
    type: VersioningType.URI, // la versión va en la URL
    defaultVersion: '1', // la ruta que no diga nada es v1
  });

  // Comprueba los DTO en todas las rutas
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // quita los campos que no estén en el DTO...
      forbidNonWhitelisted: true, // ...o mejor: responde 400 si llegan
      transform: true, // aplica las transformaciones del DTO (como el trim)
    }),
  );

  // Cabeceras de seguridad en todas las respuestas (y quita X-Powered-By)
  app.use(helmet());

  // Todos los errores con la misma forma
  app.useGlobalFilters(new AllExceptionsFilter());
}
