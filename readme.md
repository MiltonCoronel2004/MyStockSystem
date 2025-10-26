# MyStockSystem

Sistema de gestión de inventario y productos para pequeñas y medianas empresas. Permite administrar usuarios, productos y operaciones básicas de stock mediante una interfaz web moderna y una API RESTful segura.

---

## Descripción General

**Problema que resuelve:**
Facilita el control y seguimiento de inventario, registro de productos y gestión de usuarios, optimizando procesos administrativos y reduciendo errores manuales.

**Funcionalidades principales:**

- Autenticación y registro de usuarios.
- Creación, edición, listado y eliminación de productos.
- Gestión de inventario.
- Interfaz web intuitiva y responsiva.
- API RESTful para operaciones CRUD.

**Arquitectura general:**

- **Frontend:** SPA en React, comunicación con backend vía API REST.
- **Backend:** Servidor Express.js, lógica de negocio y persistencia.
- **Base de datos:** (No incluida en el código, pero se infiere uso de MySQL por la configuración en `db.js`).
- **Comunicación:** HTTP/JSON entre frontend y backend.

---

## Tecnologías Utilizadas

**Frontend:**

- React (SPA)
- Vite (bundler)
- Zustand (gestión de estado)
- CSS Modules

**Backend:**

- Node.js
- Express.js
- express-validator (validación de datos)
- JWT (autenticación)
- MySQL (persistencia, inferido por `db.js`)

**Dependencias clave:**

- `react`, `react-dom`: UI
- `zustand`: manejo de estado global
- `express`: servidor HTTP
- `express-validator`: validación de datos en rutas
- `jsonwebtoken`: autenticación
- `mysql2`: conexión a base de datos

---

## Requisitos Previos

- **Node.js:** v18.x o superior recomendado
- **npm:** v9.x o superior
- **MySQL:** Instalado y corriendo localmente/remoto
- **Dependencias globales recomendadas:**
  - `nodemon` (para desarrollo backend)

---

## Instalación y Configuración Inicial

```bash
# Clonar el repositorio
git clone https://github.com/MiltonCoronel2004/MyStockSystem.git
cd MyStockSystem

# Instalar dependencias del backend
cd server
npm install

# Instalar dependencias del frontend
cd ../client
npm install
```

**Configurar variables de entorno:**

Crea los archivos `.env` en `server/` y `client/` siguiendo los ejemplos `.env.example`.

**Ejemplo de archivo .env (backend):**

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=mystocksystem
JWT_SECRET=tu_secreto
PORT=4000
```

**Variables críticas:**

- Conexión a base de datos: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- JWT: `JWT_SECRET`
- Puerto backend: `PORT`

---

## Ejecución del Proyecto

**Backend:**

```bash
cd server
npm run dev   # (con nodemon, si instalado)
# o
node index.js
```

**Frontend:**

```bash
cd client
npm run dev
```

**Notas:**

- El frontend corre por defecto en `http://localhost:5173`
- El backend corre por defecto en `http://localhost:4000`
- Para producción, configurar variables y usar `npm run build` en el frontend.

---

## Estructura del Proyecto

```
MyStockSystem/
│
├── client/           # Frontend React
│   ├── src/
│   │   ├── components/   # Componentes reutilizables (Button, Form, Input)
│   │   ├── pages/        # Vistas principales (Login, Products, Register, etc.)
│   │   │   └── layouts/  # Layouts públicos/privados
│   │   ├── store/        # Hooks de estado global (useStore.js)
│   │   ├── assets/       # Recursos estáticos
│   │   └── main.jsx      # Entry point
│   ├── public/           # Archivos estáticos
│   └── ...               # Configuración Vite, ESLint, etc.
│
├── server/           # Backend Node/Express
│   ├── config/           # Configuración de base de datos
│   ├── controllers/      # Lógica de negocio (product, user)
│   ├── middlewares/      # Middlewares de validación y autenticación
│   ├── models/           # Modelos de datos (Product, User, TokenBlacklist)
│   ├── routes/           # Rutas API (productRoutes, userRoutes)
│   └── index.js          # Entry point
│
└── readme.md         # Documentación
```

---

## Uso del Sistema

**Flujo básico:**

1. El usuario accede al frontend y se registra o inicia sesión.
2. Una vez autenticado, puede crear, editar, listar y eliminar productos.
3. El sistema valida los datos y actualiza el inventario.

**Ejemplo de endpoints API:**

| Método | Ruta                  | Descripción         |
| ------ | --------------------- | ------------------- |
| POST   | `/api/users/register` | Registro de usuario |
| POST   | `/api/users/login`    | Login de usuario    |
| GET    | `/api/products`       | Listar productos    |
| POST   | `/api/products`       | Crear producto      |
| PUT    | `/api/products/:id`   | Editar producto     |
| DELETE | `/api/products/:id`   | Eliminar producto   |

---

## Dependencias Clave

| Paquete           | Propósito                      |
| ----------------- | ------------------------------ |
| express           | Servidor HTTP backend          |
| express-validator | Validación de datos en rutas   |
| jsonwebtoken      | Autenticación JWT              |
| mysql2            | Conexión a base de datos MySQL |
| react             | UI frontend                    |
| zustand           | Estado global frontend         |
| react-toastify    | Notificaciones frontend        |
| vite              | Bundler frontend               |

---

## Buenas Prácticas y Notas de Desarrollo

- Mantener las variables de entorno fuera del control de versiones.
- Usar middlewares para validación y autenticación.
- Separar lógica de negocio en controladores.
- Extender el sistema agregando nuevos modelos y rutas siguiendo la estructura actual.
- Para depuración, usar logs en backend y herramientas de desarrollo en React.
- Validar la configuración de la base de datos antes de iniciar el backend.

---

## Licencia

Este proyecto no especifica una licencia. Añade una sección de licencia si es necesario para tu caso de uso.

---

## Notas Técnicas

- **Base de datos:** El sistema asume una base de datos MySQL configurada, pero no incluye migraciones ni scripts de creación de tablas. Es necesario crear la base y las tablas manualmente según los modelos.
- **Variables de entorno:** Verifica que los archivos `.env` estén correctamente configurados en ambos módulos.
- **Consistencia:** Si detectas rutas, modelos o validaciones que no coinciden entre frontend y backend, revisa la integración y ajusta según sea necesario.

---

¿Dudas o sugerencias? Abre un issue en el repositorio.
