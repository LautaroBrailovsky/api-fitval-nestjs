# API de FitVal

API del gimnasio FitVal con NestJS y PostgreSQL: planes, clases, monitores, registro, login con JWT y permisos.

- **API en Render:** https://api-fitval-lautarobrailovsky.onrender.com/api/v1/health
- **Documentación (Swagger):** https://api-fitval-lautarobrailovsky.onrender.com/docs

> Render (plan gratis) duerme la API si no se usa: la primera petición puede tardar unos 50 segundos.

## En local

```bash
npm install
cp .env.example .env          # y cambia CAMBIAME por los valores de verdad
docker compose up -d
docker exec -i postgres-fitval psql -U alumno -d fitval < database/schema.sql
npm run start:dev             # http://localhost:3000/api/v1/health y /docs
```

## Tests

```bash
npm test             # unitarios (no necesitan PostgreSQL)
npm run test:e2e     # integración (con postgres-fitval arrancado)
```
