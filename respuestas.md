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

