# Vacancy Application

**Kelmin Ely Miranda Hurtado - NestJS** 

## Instrucciones de ejecución

Prerequisitos: Docker y Node.js + npm (opcional si usas Docker).

1. Levantar con Docker Compose (recomendado):

```bash
# desde la raíz del repo
docker compose up -d --build
```

2. Ejecutar localmente (sin Docker):

```bash
# dentro de la carpeta app
npm install
npm run seed         # (opcional) correr seeders que crean roles y usuarios
npm run start:dev
```

3. Build y producción:

```bash
npm run build
npm run start:prod
```

## Enums

1. Modality
```
REMOTO = 'REMOTO',
HIBRIDO = 'HIBRIDO',
PRESENCIAL = 'PRESENCIAL'
```

2. Role
```
CODER = 'CODER',
GESTOR = 'GESTOR',
ADMIN = 'ADMIN',
```

3. Vacancy Status
```
ACTIVE = 'ACTIVE',
INACTIVE = 'INACTIVE',
```

## URL de Swagger

La documentación Swagger está disponible en:

http://localhost:3000/api/v1/docs

> Usa el botón "Authorize" y pega el token con el prefijo `Bearer `, por ejemplo:
>
> `Bearer eyJhbGciOiJI...`

## Ejemplos de endpoints

Autenticación:

- POST /auth/login
	- Body: `{ "email": "admin@admin.com", "password": "123456" }`
	- Devuelve: `{ "access_token": "..." }`

Usuarios:

- POST /users  (Registro)
	- Body: `{ "email": "coder@example.com", "password": "123456", "fullname": "Coder Name" }`

Vacantes:

- GET /vacancies
	- Lista vacantes. Cada vacante incluye `remainingSlots` y `canApply`.

- GET /vacancies/:id
	- Detalle de vacante con `remainingSlots` y `canApply`.

- POST /vacancies
	- Requiere rol `GESTOR` o `ADMIN` (Bearer token)
	- Crea vacante.

- PATCH /vacancies/:id
	- Requiere rol `GESTOR` o `ADMIN` (Bearer token)
	- Actualiza vacante (puedes cambiar `maxApplicants` o `status`).

- DELETE /vacancies/:id
	- Requiere rol `ADMIN` (Bearer token)

Postulaciones (Applications):

- POST /applications
	- Requiere rol `CODER` (Bearer token)
	- Body: `{ "userId": 3, "vacancyId": 5 }`
	- Reglas: no más de 3 postulaciones activas por usuario; no postular si `remainingSlots === 0`; no postular a vacantes `INACTIVE`.

- GET /applications
	- Requiere rol `GESTOR` o `ADMIN` (Bearer token)
	- Lista todas las postulaciones.

- GET /applications/user/:email
	- Requiere autenticación. Los `CODER` solo pueden consultar su propio correo.

## Curl de ejemplo (login + usar token)

```bash
# Login y obtener token
curl -s -X POST http://localhost:3000/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"admin@admin.com","password":"123456"}' | jq

# Usar token (reemplaza <TOKEN>)
curl -X GET http://localhost:3000/vacancies \
	-H "Authorization: Bearer <TOKEN>"
```

## Usuarios sembrados
```
admin@admin.com - 123456
```

```
gestor@gestor.com - 123456
```

---

## Ejemplos de respuestas (JSON)

1) Respuesta de login (éxito)

```json
{
  "success": true,
  "data": {
    "user_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAdGVzdC5jb20iLCJzdWIiOjMsInJvbGUiOiJDT0RFUiIsImlhdCI6MTc2NzYzMjgxMSwiZXhwIjoxNzY3NjM2NDExfQ.M3SHkIfDCQ2Oddl-ug5ItQAvkhH8borGh4rYGoJfdkk",
    "user": {
      "id": 3,
      "email": "user@test.com",
      "role": "CODER"
    }
  },
  "message": "Operation completed successfully"
}
```

2) GET /vacancies (lista)

```json
{
  "success": true,
  "data": [
    {
      "createdAt": "2026-01-05T16:13:28.138Z",
      "updatedAt": "2026-01-05T16:13:28.138Z",
      "idVacancy": 1,
      "title": "Frontend Developer",
      "description": "We are looking for a skilled frontend developer...",
      "technologies": "React, TypeScript, Node.js",
      "seniority": "Junior",
      "softSkills": "Teamwork, Communication, Problem-solving",
      "location": "Barranquilla, Colombia",
      "modality": "REMOTO",
      "salaryRange": "1500",
      "company": "Gases del Caribe.",
      "maxApplicants": 10,
      "status": "ACTIVE",
      "remainingSlots": 5,
      "canApply": true
    }
  ],
  "message": "Operation completed successfully"
}
```

3) GET /vacancies/:id (detalle)

```json
{
  "success": true,
  "data": {
      "createdAt": "2026-01-05T16:13:28.138Z",
      "updatedAt": "2026-01-05T16:13:28.138Z",
      "idVacancy": 1,
      "title": "Frontend Developer",
      "description": "We are looking for a skilled frontend developer...",
      "technologies": "React, TypeScript, Node.js",
      "seniority": "Junior",
      "softSkills": "Teamwork, Communication, Problem-solving",
      "location": "Barranquilla, Colombia",
      "modality": "REMOTO",
      "salaryRange": "1500",
      "company": "Gases del Caribe.",
      "maxApplicants": 10,
      "status": "ACTIVE",
      "remainingSlots": 5,
      "canApply": true
    }
  "message": "Operation completed successfully"
}
```

4) POST /applications (éxito)

```json
{
  "success": true,
  "data": {
    "createdAt": "2026-01-05T17:11:46.238Z",
    "updatedAt": "2026-01-05T17:11:46.238Z",
    "idApplication": 1,
    "userId": 3,
    "vacancyId": 1,
    "appliedAt": "2026-01-01T12:00:00.000Z"
  },
  "message": "Operation completed successfully"
}
```

5) POST /applications (error: vacante llena)

```json
{
	"statusCode": 400,
	"message": "Maximum number of applicants reached for this vacancy",
	"error": "Bad Request"
}
```

6) POST /applications (error: límite de usuario)

```json
{
	"statusCode": 400,
	"message": "User has reached the maximum of 3 active applications",
	"error": "Bad Request"
}
```

7) GET /applications/user/:email (respuesta — lista de vacantes aplicadas)

```json
[
	{
		"idVacancy": 5,
		"title": "Fullstack Developer",
		"company": "ACME Ltd.",
		"remainingSlots": 4,
		"canApply": true
	},
	{
		"idVacancy": 8,
		"title": "Frontend Developer",
		"company": "Gamma",
		"remainingSlots": 2,
		"canApply": true
	}
]
```