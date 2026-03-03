# Documentación del README.md y Solución Implementada

Este documento describe la estructura del `README.md` del proyecto Ethos PBS - Reto Técnico y **documenta cómo la solución implementada cumple con cada requisito**.

---

## Parte 1: Estructura del README

### 1.1 Propósito del archivo

El `README.md` es el punto de entrada principal del repositorio. Sirve como:

- **Guía del proyecto**: Explica el objetivo del reto técnico
- **Especificación técnica**: Define el stack, requisitos y alcance
- **Instrucciones de entrega**: Detalla el proceso de desarrollo y criterios de evaluación


## Parte 2: Solución Implementada 

### 2.1Backend con Arquitectura Hexagonal

#### Entidades (al menos dos: User y Project)

| Entidad | Ubicación | Campos |
|---------|-----------|--------|
| **User** | `api/src/domain/entities/User.ts` | `id`, `email`, `password`, `first_name`, `last_name` |
| **Project** | `api/src/domain/entities/Project.ts` | `id`, `name`, `description`, `user_id`, `status`, `created_at` |

#### Puertos (interfaces del dominio)

| Puerto | Ubicación | Métodos |
|--------|-----------|---------|
| **UserRepository** | `domain/repositories/UserRepository.ts` | `create`, `update`, `findByEmail`, `findById`, `findAll`, `delete` |
| **ProjectRepository** | `domain/repositories/ProjectRepository.ts` | `create`, `update`, `findById`, `findByName`, `findAll`, `delete` |

#### Adaptadores (infraestructura)

| Puerto | Adaptador | Ubicación |
|--------|-----------|-----------|
| UserRepository | PostgresUserRepository | `infrastructure/database/PostgresUserRepository.ts` |
| ProjectRepository | PostgresProjectRepository | `infrastructure/database/PostgresProjectRepository.ts` |

#### Lógica de negocio en el dominio

- Casos de uso en `application/use-cases/` (CreateUser, UpdateUser, AuthenticateUser, etc.)
- Entidades y reglas en `domain/entities/`

---

### 2.3 Endpoint de Autenticación

| Requisito | Implementación |
|-----------|----------------|
| Endpoint para autenticación | `POST /api/v1/auth/login` |
| Body | `{ email, password }` |
| Respuesta | `{ token }` (JWT) |
| Flujo | `AuthenticateUser` → `findByEmail` → `argon2.verify` → JWT con `jose` (SignJWT) |
| Token | HS256, expiración 1h, payload `{ userId }` |

---

### 2.4 Rutas Protegidas

| Ruta | Métodos | Middleware |
|------|---------|------------|
| `/api/v1/users` | GET, POST | `authMiddleware` |
| `/api/v1/users/:id` | PUT, DELETE | `authMiddleware` |
| `/api/v1/projects` | GET, POST | `authMiddleware` |
| `/api/v1/projects/:id` | PUT, DELETE | `authMiddleware` |

**authMiddleware** (`interfaces/http/middleware/authMiddleware.ts`): exige `Authorization: Bearer <token>`, valida con `verifyToken` (jose) y expone `user: { userId }` en el contexto.

---

### 2.5 Rate Limiter

| Requisito README | Implementación |
|------------------|----------------|
| Sin paquetes externos de rate limiting | Implementación propia en `interfaces/http/middleware/rateLimiter.ts` |
| Almacenamiento en memoria | `Map<string, RateLimitEntry>` |
| Registro por IP o usuario autenticado | Con token: `user:${userId}`; sin token: IP (`x-forwarded-for`, `x-real-ip`) |
| Estructuras nativas | `Map`, objetos |
| Ventana de tiempo configurable | Parámetro `windowMs` (ej: 60_000 ms) |
| Número máximo de peticiones configurable | Parámetro `maxRequests` (ej: 100) |

**Configuración actual**: `rateLimiter(100, 60_000)` → 100 peticiones por 60 segundos.

**Respuesta al exceder**: HTTP 429, `{ error: "Too Many Requests", message: "Has excedido el límite de peticiones" }`.

---

### 2.6 Endpoints CRUD (GET /api/users, GET /api/projects, etc.)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/users` | Lista usuarios |
| POST | `/api/v1/users` | Crear usuario |
| PUT | `/api/v1/users/:id` | Actualizar usuario |
| DELETE | `/api/v1/users/:id` | Eliminar usuario |
| GET | `/api/v1/projects` | Lista proyectos |
| POST | `/api/v1/projects` | Crear proyecto |
| PUT | `/api/v1/projects/:id` | Actualizar proyecto |
| DELETE | `/api/v1/projects/:id` | Eliminar proyecto |

---

### 2.7 Conexión a Base de Datos

| Requisito | Implementación |
|-----------|----------------|
| App conectada a BD | `infrastructure/database/connection.ts` con `pg.Pool` |
| Tablas creadas | `users`, `projects` (ver `api/script.sql`) |
| Lectura/escritura real | PostgresUserRepository y PostgresProjectRepository realizan queries reales |

**Variables de entorno**: `DB_USER`, `DB_HOST`, `DB_DATABASE`, `DB_PASSWORD`, `DB_PORT`, `DB_MAX`, `DB_IDLE_TIMEOUT`

---

## Parte 3: Estructura del Proyecto

```
ethos-backend-coding-challenge/
├── api/
│   ├── src/
│   │   ├── index.ts
│   │   ├── application/use-cases/     # Casos de uso
│   │   │   ├── AuthenticateUser.ts
│   │   │   ├── CreateUser.ts, CreateProject.ts
│   │   │   ├── GetUsers.ts, GetProjects.ts
│   │   │   ├── UpdateUser.ts, UpdateProject.ts
│   │   │   └── DeleteUser.ts, DeleteProject.ts
│   │   ├── domain/
│   │   │   ├── entities/User.ts, Project.ts
│   │   │   ├── repositories/UserRepository.ts, ProjectRepository.ts
│   │   │   └── errors/AppError.ts
│   │   ├── infrastructure/
│   │   │   ├── auth/jwt.ts
│   │   │   └── database/
│   │   │       ├── connection.ts
│   │   │       ├── PostgresUserRepository.ts
│   │   │       └── PostgresProjectRepository.ts
│   │   └── interfaces/http/
│   │       ├── server.ts
│   │       ├── middleware/authMiddleware.ts, rateLimiter.ts
│   │       └── routes/userRoutes.ts, authRoutes.ts, projectRoutes.ts
│   ├── script.sql
│   └── .env.example
├── README.md
└── DOCUMENTACION_README.md
```

---