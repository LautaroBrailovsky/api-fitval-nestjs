# Respuestas – API FitVal

## Ejercicio 0

```
remote: error: GH013: Repository rule violations found for refs/heads/main.
remote: - Changes must be made through a pull request.
 ! [remote rejected] main -> main (push declined due to repository rule violations)
```

## Pregunta 1

El cliente recibe un `500` con `"Internal server error"`. En la terminal de Nest sale el error de verdad (`ECONNREFUSED 127.0.0.1:5433`, y `PostgreSQL: terminating connection...`). Es mejor así porque el cliente no necesita saber detalles internos (puertos, base de datos) y no le damos pistas a un atacante; el detalle lo vemos nosotros en los logs.

## Pregunta 2

Con la versión mala salen las 7 clases; con `$1` sale 0. En la mala, a PostgreSQL le llega:

```sql
... WHERE c.activity ILIKE '%zzz' OR 1=1 --%' ORDER BY c.starts_at
```

La comilla cierra el texto, `OR 1=1` es siempre verdad y `--` comenta el resto, así que devuelve todo. Con `$1` el valor va aparte y PostgreSQL lo trata solo como texto, nunca como SQL.

## Pregunta 3

Para devolver un `400` claro ("no existe ese monitor"), porque el error es del cliente. Si no lo comprobáramos, el `INSERT` fallaría por la clave ajena y el cliente recibiría un `500`, como si fuera culpa nuestra.

## Pregunta 4

Porque la petición está bien hecha (id válido y la clase existe), pero choca con el estado actual de los datos: tiene reservas. `400` es para cuando el cliente envía algo mal; `409` es conflicto con lo que ya hay.

## Pregunta 5

Lleva `{ "sub": 1, "iat": ..., "exp": ... }`: el id del usuario, cuándo se creó y cuándo caduca. El rol no se mete porque el token no se puede cambiar hasta que caduca: si le cambias el rol a alguien en la base de datos, su token seguiría diciendo el rol viejo. Además el payload se lee sin la clave (solo va en base64), así que mejor meter lo mínimo.

## Pregunta 6

Porque el `StaffGuard` no mira el rol en el token: con el `sub` busca al usuario en la base de datos en cada petición y ve el rol actual (`staff`). Si el rol fuera dentro del token, seguiría diciendo `member` hasta que hiciera login otra vez (y al revés: si le quitas el `staff`, podría seguir creando clases hasta que caducara el token).

## Pregunta 7

No necesita PostgreSQL porque le pasamos un `Pool` falso: `query` responde lo que le decimos con `mockResolvedValue`, así que solo probamos la lógica del servicio (si lanza el `400` y si hace o no el `INSERT`). Lo que no puede comprobar es que el SQL esté bien escrito ni que funcione contra la base de datos real (columnas, `JOIN`, claves ajenas...).

## Pregunta 8

Porque cada ejecución registra un usuario nuevo y el email es `UNIQUE`. Con un correo fijo, la segunda vez el registro daría `409` y los tests que dependen de ese usuario fallarían (o habría que borrar el usuario a mano antes de cada ejecución).

## Pregunta 9

Porque lo que va dentro del `${...}` nunca es el texto del cliente: el DTO solo deja pasar `startsAt`, `activity` o `spots` (`@IsIn`), y luego lo cambiamos por una columna de nuestra tabla `SORT_COLUMNS`. Con `?sort=id;DROP TABLE classes` el `ValidationPipe` responde `400` ("sort must be one of the following values...") y el SQL ni se ejecuta.

## Pregunta 10

Porque en el login es donde alguien puede probar contraseñas una detrás de otra (ataque de fuerza bruta). Con 5 intentos por minuto se vuelve lentísimo. Sin `trust proxy`, en Render todas las peticiones parecerían venir de la IP del proxy de Render, así que todos los usuarios compartirían el mismo límite y unos pocos bloquearían a todo el mundo.

