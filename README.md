# API RESTful para Tienda Online - Prueba Técnica TECOPOS

Esta es la implementación de una API RESTful para gestionar una tienda online, desarrollada como parte de la prueba técnica para la posición de Desarrollador Backend en TECOPOS. La API está construida con **NestJS** y **TypeORM**, utilizando una base de datos **PostgreSQL**.

## Características Principales

-   **Framework**: NestJS
-   **Base de Datos**: PostgreSQL
-   **ORM**: TypeORM
-   **Autenticación**: JWT (JSON Web Tokens) para proteger rutas.
-   **Validación**: Uso de `class-validator` y `class-transformer` para validar los DTOs.
-   **Documentación**: Documentación de la API generada automáticamente con Swagger (OpenAPI).
-   **Roles**: Implementación de roles básicos (admin, user) para control de acceso.
-   **Testing**: Pruebas unitarias y de integración con Jest.
-   **Despliegue**: API desplegada en una plataforma pública (Render/Railway/Fly.io).

---

## Despliegue y Documentación

-   **URL de la API Desplegada**: `https://tu-proyecto-desplegado.onrender.com` *(<-- ¡Reemplaza esto con tu URL real!)*
-   **Documentación Interactiva (Swagger)**: [`https://tu-proyecto-desplegado.onrender.com/api`](https://tu-proyecto-desplegado.onrender.com/api) *(<-- ¡Reemplaza esto con tu URL real!)*

---

## Requisitos Previos

-   Node.js (v18 o superior recomendado)
-   npm o pnpm
-   PostgreSQL (puede ser una instancia local, en Docker o una pública como ElephantSQL)

---

## Instalación y Configuración Local

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    cd tu-repositorio
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
    O si usas `pnpm`:
    ```bash
    pnpm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto, copiando el contenido de `.env.example` y rellenando los valores correspondientes.

    **`.env.example`**:
    ```dotenv
    # Base de Datos
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=tu_contraseña_de_db
    DB_NAME=tienda_online

    # JWT
    JWT_SECRET=TU_SECRETO_SUPER_SECRETO
    ```
    *Nota: Si usas una URL de conexión completa (como la de ElephantSQL o Neon), puedes usar la variable `DATABASE_URL` en su lugar.*

4.  **Ejecutar las migraciones (si usas TypeORM CLI):**
    Si has configurado migraciones, este es el momento de ejecutarlas.
    ```bash
    npm run typeorm:run-migrations
    ```

5.  **Iniciar la aplicación en modo desarrollo:**
    La aplicación se iniciará en `http://localhost:3000` y se recargará automáticamente con cada cambio.
    ```bash
    npm run start:dev
    ```

---

## Scripts Disponibles

-   `npm run start`: Inicia la aplicación en modo producción.
-   `npm run start:dev`: Inicia la aplicación en modo desarrollo con hot-reload.
-   `npm run build`: Compila el proyecto TypeScript a JavaScript.
-   `npm run test`: Ejecuta todas las pruebas unitarias y de integración.
-   `npm run test:watch`: Ejecuta las pruebas en modo "watch".
-   `npm run test:cov`: Ejecuta las pruebas y genera un informe de cobertura.

---

## Estructura de la API y Endpoints

A continuación se describen los principales endpoints. Para una documentación completa e interactiva, por favor visita la [**documentación de Swagger**](https://tu-proyecto-desplegado.onrender.com/api).

*(<-- ¡Reemplaza el enlace de arriba!)*

### Autenticación (`/auth`)

-   `POST /auth/register`: Registrar un nuevo usuario.
-   `POST /auth/login`: Iniciar sesión y obtener un token JWT.

### Productos (`/products`)

-   `GET /products`: Listar todos los productos (con paginación y filtros). **(Público)**
-   `GET /products/:id`: Obtener un producto por su ID. **(Público)**
-   `POST /products`: Crear un nuevo producto. **(Admin)**
-   `PATCH /products/:id`: Actualizar un producto existente. **(Admin)**
-   `DELETE /products/:id`: Eliminar un producto. **(Admin)**

### Órdenes (`/orders`)

-   `POST /orders`: Crear una nueva orden. **(Usuario autenticado)**
-   `GET /orders`: Listar las órdenes del usuario autenticado. **(Usuario autenticado)**
-   `GET /orders/:id`: Ver el detalle de una orden específica. **(Dueño de la orden o Admin)**

---

## Uso de la API (Ejemplos)

Para interactuar con las rutas protegidas, es necesario incluir el token JWT en la cabecera `Authorization`.

**Header:**
Authorization: Bearer <tu_token_jwt>

Puedes obtener este token del endpoint `POST /auth/login`. La interfaz de Swagger tiene una opción "Authorize" para facilitar las pruebas de estas rutas.