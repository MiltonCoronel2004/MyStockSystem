# MyStockSystem — Documentación 

## 1. Propósito y alcance

Sistema full-stack para gestión de usuarios y productos. Incluye:

* **API REST** en Node.js/Express con Sequelize/MySQL, autenticación JWT y lista negra de tokens.
* **SPA** en React (Vite), estado global con Zustand y UI con Tailwind + Toastify.
* **Despliegue serverless en Vercel** (adaptador `api/index.js` y `vercel.json`).

---

## 2. Arquitectura general

### 2.1 Estructura del repositorio

```
MyStockSystem/
├─ client/               # SPA React + Vite
│  ├─ src/
│  │  ├─ components/     # Button, Form, Input
│  │  ├─ pages/          # Login, Register, Products, EditProduct, CreateProduct
│  │  │  └─ layouts/     # Public (sin sesión), Private (con sesión)
│  │  ├─ store/          # Zustand: useStore.js (persist)
│  │  ├─ App.jsx, main.jsx, index.css
│  ├─ .env.example       # VITE_API_URL
│  ├─ vite.config.js     # Plugins: react-swc, tailwind/vite
│  └─ vercel.json        # (solo client) redirect hosting SPA si aplica
├─ server/               # API REST Express
│  ├─ api/index.js       # handler serverless para Vercel
│  ├─ app.js             # instancia Express, middlewares y rutas
│  ├─ index.js           # arranque local (listen)
│  ├─ vercel.json        # build y routing para serverless API
│  ├─ config/db.js       # Sequelize + mysql2 (pool/SSL según Vercel)
│  ├─ controllers/       # lógica de negocio (users, products)
│  ├─ middlewares/       # auth JWT, validators y manejador de validaciones
│  ├─ models/            # User, Product, TokenBlacklist, associations
│  ├─ routes/            # userRoutes, productRoutes
│  ├─ sync.js            # sincronización de schema (alter) manual
│  └─ .env.example       # variables de entorno
└─ readme.md             # guía rápida del repo
```

### 2.2 Flujo de datos

1. **Cliente** obtiene `VITE_API_URL` y realiza peticiones `fetch` a endpoints REST.
2. **Autenticación**: al hacer login, el backend emite un **JWT** y el cliente guarda en Zustand un objeto `user` con `token` ya formateado como `Bearer <jwt>`.
3. **Autorización**: las rutas de productos requieren `Authorization: Bearer <jwt>`.
4. **Logout**: el backend guarda el token en `token_blacklist`; `verifyAuth` bloquea tokens enlistados.

---

## 3. Entornos y configuración

### 3.1 Backend (`server/.env.example`)

* `DB_USER`, `DB_PASS`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_DIALECT`
* `CORS_ORIGIN` (e.g. `*` o dominio del front)
* `SECRET` (clave para `jsonwebtoken`)

**Conexión Sequelize** (`config/db.js`):

* Dialect: `mysql` con `mysql2`.
* Detección de Vercel (`process.env.VERCEL === "1"`).
* `dialectOptions` con `ssl.require=true` y `rejectUnauthorized=false` en producción.
* Pool:

  * Prod: `{ max:1, min:0, acquire:3000, idle:10000 }`
  * Dev: `{ max:5, min:0, acquire:30000, idle:10000 }`
* `logging: false`.

### 3.2 Frontend (`client/.env.example`)

* `VITE_API_URL` → base de la API (ej. `http://localhost:3000` o URL Vercel/Render).

---

## 4. Dependencias principales

### 4.1 Servidor

* `express` (v5), `cors`, `dotenv`
* `sequelize`, `mysql2`
* `jsonwebtoken` (JWT), `bcrypt` (hash de contraseña)
* `express-validator` (validación de payload)
* `nodemon` (dev)

### 4.2 Cliente

* `react` 19 + `react-dom` 19
* `react-router` 7
* `zustand` (+ `persist` middleware)
* `react-toastify`
* `lucide-react` (iconos)
* `@tailwindcss/vite` + Tailwind
* `@vitejs/plugin-react-swc`

---

## 5. Backend

### 5.1 Entrada/arranque

* **Local**: `server/index.js`

  * Levanta `app.listen(PORT)` y hace `sequelize.sync({ alter:false })`.
* **Serverless (Vercel)**:

  * `server/api/index.js` exporta `handler(req,res)` que delega a `app`.
  * `server/vercel.json`:

    ```json
    { "version": 2,
      "builds": [{ "src": "api/**/*.js", "use": "@vercel/node" }],
      "routes": [{ "src": "/(.*)", "dest": "api/index.js" }] }
    ```

### 5.2 Middlewares globales

* `cors({ origin: process.env.CORS_ORIGIN || "*" })`
* `express.json()`
* Saludo `GET /` → `{ message: "API MyStockSystem online" }`
* Hook conexión DB por request (authenticate → 500 si falla)

### 5.3 Modelos y asociaciones

**User** (`models/User.js`)

* Campos:

  * `id` INT PK auto-increment
  * `fullName` STRING(100) requerido (2–100)
  * `email` STRING único requerido (formato email)
  * `hash` STRING requerido (bcrypt)
  * `activateToken` STRING nullable
  * `activatedAt` DATE nullable
  * Timestamps `created_at`, `updated_at`; `paranoid` (soft delete `deleted_at`)
  * Índice único en `email`
  * `underscored: true`, `tableName: "users"`

**Product** (`models/Product.js`)

* Campos:

  * `id` INT PK auto-increment
  * `name` STRING(100) requerido (2–100)
  * `price` DECIMAL(10,2) requerido, `> 0`
  * `stock` INT requerido, `>= 0`
  * Timestamps; `underscored: true`, `tableName: "products"`

**TokenBlacklist** (`models/TokenBlacklist.js`)

* `token` STRING único requerido
* `expiresAt` DATE requerido
* Timestamps; `tableName: "token_blacklist"`

**Asociaciones** (`models/associations.js`)

* `User.hasMany(Product, { foreignKey: "user_id", onDelete: "CASCADE" })`
* `Product.belongsTo(User, { foreignKey: "user_id" })`

### 5.4 Validaciones (express-validator)

**Usuarios** (`middlewares/userValidator.js`)

* `fullName`: `notEmpty`, `length 2..100`
* `email`: `notEmpty`, `isEmail`, **único** (consulta `User.findOne`)
* `password`: `notEmpty`, `length >= 6`
* `confirmPassword`: `notEmpty`, debe igualar `password`

**Login**

* `email`: `notEmpty`, `isEmail`
* `password`: `notEmpty`

**Productos** (`middlewares/productValidator.js`)

* **Create**:

  * `name`: `notEmpty`, `length 2..100`
  * `price`: `notEmpty`, `isDecimal(0,2)`, `> 0`
  * `stock`: `notEmpty`, `isInt`, `>= 0`
* **Update (opcionales)**:

  * `name`: `length 2..100` si se envía
  * `price`: `isDecimal(0,2)`, `> 0` si se envía
  * `stock`: `isInt`, `>= 0` si se envía

**Manejador de errores** (`middlewares/expressValidator.js`)

* Devuelve `400` con `{ error:true, msg:[mensajes] }`.

### 5.5 Autenticación y autorización

**Middleware** (`middlewares/authMiddleware.js`)

* Lee `Authorization` y extrae token (segundo elemento de `split(" ")`).
* Rechaza si está en **TokenBlacklist** (`401 Token Invalido`).
* `jwt.verify(token, SECRET)`; si OK → `req.userEmail = decoded.email`.
* Errores → `401` `"Token inválido o expirado"`.

**Emisión de JWT** (en login)

* `jwt.sign({ email }, SECRET, { expiresIn: "1h" })`.
* El controlador devuelve `token` **ya con prefijo** `"Bearer "` en `user.token`.

**Blacklisting** (logout)

* Decodifica sin validar (`jwt.decode`) para obtener `exp` → `expiresAt`.
* Guarda `{ token, expiresAt }` en `token_blacklist`.

### 5.6 Endpoints

#### Salud

* `GET /`

  * **200** → `{ message: "API MyStockSystem online" }`

#### Usuarios (`routes/userRoutes.js`)

* `POST /register`

  * Body: `{ fullName, email, password, confirmPassword }`
  * Validación: ver §5.4
  * Lógica:

    * Hash `bcrypt.hash(password, saltRounds)` (en el controlador se almacena en `hash`)
    * Crea usuario: `{ fullName, email, hash, activateToken }`
  * **200** → `{ error:false, msg:"Usuario creado", user }`
  * **400** validación | **409** email duplicado (por validator) | otros códigos según errores

* `POST /login`

  * Body: `{ email, password }`
  * Lógica:

    * Busca `User` por `email`
    * Compara `bcrypt.compare(password, user.hash)`
    * Firma JWT 1h
  * **200** →

    ```json
    {
      "error": false,
      "user": {
        "full_name": "<string>",
        "email": "<string>",
        "token": "Bearer <jwt>"
      }
    }
    ```
  * **404/403** credenciales inválidas

* `GET /getusers` **(protegido)**

  * Header: `Authorization: Bearer <jwt>`
  * **200** → `{ error:false, users:[...] }`
  * **404** si no hay usuarios
  * **401** si token ausente/inválido/en lista negra

* `POST /logout` **(protegido)**

  * Header: `Authorization: Bearer <jwt>`
  * Lógica:

    * Extrae token, calcula `expiresAt`, inserta en `token_blacklist`.
  * **200** → `{ error:false, msg:"Sesión cerrada e invalidada" }`

#### Productos (`routes/productRoutes.js`) — **todas protegidas**

* Header requerido: `Authorization: Bearer <jwt>`
  (El middleware deriva `req.userEmail` para asociar acciones al usuario)

* `GET /getproducts`

  * Obtiene `User` por `req.userEmail`
  * Lista `Product` por `user_id`
  * **200** → `{ error:false, products:[...] }`
  * **404** usuario o lista vacía

* `GET /getproduct/:id`

  * Busca por PK
  * **200** → `{ error:false, product }`
  * **404** no encontrado

* `POST /createproduct`

  * Body: `{ name, price, stock }`
  * Crea con `user_id` del usuario autenticado
  * **200** → `{ error:false, msg:"Producto creado", product }`
  * **400** validación

* `PUT /updateproduct/:id`

  * Body (opcional): `{ name?, price?, stock? }`
  * **200** → `{ error:false, msg:"Producto actualizado", product }`
  * **404** no encontrado
  * **400** validación

* `DELETE /deleteproduct/:id`

  * **200** → `{ error:false, msg:"Producto eliminado" }`
  * **404** no encontrado

---

## 6. Frontend

### 6.1 Router y rutas

* `App.jsx` (React Router 7):

  * **Públicas** (`<Public/>` layout):

    * `/login` → `pages/Login.jsx`
    * `/register` → `pages/Register.jsx`
  * **Privadas** (`<Private/>` layout):

    * `/` → `pages/Products.jsx` (listado)
    * `/create` → `pages/CreateProduct.jsx`
    * `/edit/:id` → `pages/EditProduct.jsx`

**Public**:

* Si `user.token` existe, redirige a `/`. Muestra spinner mientras resuelve.

**Private**:

* Barra superior con navegación (`NavLink` a `/`, `/create`) e iconos (`Package`, `Plus`, `LogOut`).
* Botón **Salir**:

  * `POST /logout` con `Authorization`.
  * Limpia Zustand y navega a `/login`.

### 6.2 Estado global (Zustand)

`store/useStore.js`:

* Estado `user: { email, full_name, token }`
* `setUser(newUser)` para actualizar.
* `persist` con nombre `"token"` (localStorage).
  El backend retorna `token` **con prefijo** `Bearer`, y el front lo envía tal cual en `Authorization`.

### 6.3 Páginas y comportamiento

**Login** (`pages/Login.jsx`)

* Form: `email`, `password`
* `POST /login`
* En éxito:

  * `setUser(data.user)`, `toast.success`, `navigate("/")`

**Register** (`pages/Register.jsx`)

* Form: `fullName`, `email`, `password`, `confirmPassword`
* `POST /register`
* Manejo de errores:

  * Si `data.msg` es arreglo, recorre y `toast.error` por cada mensaje
  * En éxito: `navigate("/login")`

**Products** (`pages/Products.jsx`)

* Carga inicial:

  * Usa `localStorage.getItem("token")` (Zustand persist) para extraer `user.token` y setear `token` local (variable módulo).
  * `GET /getproducts` con `Authorization`
  * Muestra tabla con `id`, `name`, `price`, `stock`.
* Acciones:

  * **Editar** → `navigate("/edit/:id")`
  * **Eliminar** → `DELETE /deleteproduct/:id`; al éxito filtra el item localmente

**CreateProduct** (`pages/CreateProduct.jsx`)

* Form: `name`, `price`, `stock`
* `POST /createproduct` con `Authorization`
* En éxito: `navigate("/")`

**EditProduct** (`pages/EditProduct.jsx`)

* Carga inicial por `id`:

  * `GET /getproduct/:id` con `Authorization`
  * Settea `formData`
* Guardar:

  * `PUT /updateproduct/:id`
  * En éxito: `navigate("/")`

### 6.4 Componentes UI

* **Form** (`components/Form.jsx`): contenedor visual (tarjeta, fondo con efectos, soporta `title` y `Legend`).
* **Input** (`components/Input.jsx`): input estilizado con etiqueta.
* **Button** (`components/Button.jsx`): botón primario/estado `loading`.

### 6.5 Estilo y utilidades

* **Tailwind** (vía `@tailwindcss/vite`) con gradientes, blur y sombras personalizadas.
* **React-Toastify**:

  * `ToastContainer` configurado en `App.jsx` (tema oscuro, clases personalizadas).
* **Lucide-react**:

  * Iconos `Package`, `Plus`, `LogOut`, `Pencil`, `Trash2`.

---

## 7. API: contratos resumidos

> Todas las respuestas incluyen `error: boolean`. En caso de error también `msg` (string o array de strings de validación). Para rutas protegidas, incluir `Authorization: Bearer <jwt>`.

### 7.1 Usuarios

**POST /register**
*Request*

```json
{ "fullName": "John Doe", "email": "john@acme.com", "password": "Secret123", "confirmPassword": "Secret123" }
```

*Response 200*

```json
{ "error": false, "msg": "Usuario creado", "user": { "id": 1, "fullName": "John Doe", "email": "john@acme.com", "...": "..." } }
```

**POST /login**
*Request*

```json
{ "email": "john@acme.com", "password": "Secret123" }
```

*Response 200*

```json
{
  "error": false,
  "user": { "full_name": "John Doe", "email": "john@acme.com", "token": "Bearer <jwt>" }
}
```

**GET /getusers** *(protegido)*
*Response 200*

```json
{ "error": false, "users": [ { "id": 1, "fullName": "John Doe", "email": "john@acme.com" } ] }
```

**POST /logout** *(protegido)*
*Response 200*

```json
{ "error": false, "msg": "Sesión cerrada e invalidada" }
```

### 7.2 Productos *(todas protegidas)*

**GET /getproducts**
*Response 200*

```json
{ "error": false, "products": [ { "id": 1, "name": "Item A", "price": "10.00", "stock": 5 } ] }
```

**GET /getproduct/:id**
*Response 200*

```json
{ "error": false, "product": { "id": 1, "name": "Item A", "price": "10.00", "stock": 5 } }
```

**POST /createproduct**
*Request*

```json
{ "name": "Item A", "price": "10.00", "stock": 5 }
```

*Response 200*

```json
{ "error": false, "msg": "Producto creado", "product": { "id": 1, "name": "Item A", "price": "10.00", "stock": 5 } }
```

**PUT /updateproduct/:id**
*Request* *(campos opcionales)*

```json
{ "name": "Item A+", "price": "12.50", "stock": 7 }
```

*Response 200*

```json
{ "error": false, "msg": "Producto actualizado", "product": { "id": 1, "name": "Item A+", "price": "12.50", "stock": 7 } }
```

**DELETE /deleteproduct/:id**
*Response 200*

```json
{ "error": false, "msg": "Producto eliminado" }
```

---

## 8. Seguridad y sesión

* **JWT Bearer 1h** con `SECRET`.
* **Blacklist de tokens** en logout (`token_blacklist`) con `expiresAt` del `exp` del JWT.
* **Verificación**: `verifyAuth`:

  * Rechaza sin `Authorization`
  * Rechaza si token en blacklist
  * Verifica firma/expiración; expone `req.userEmail` para scoping.
* **CORS** configurable por variable `CORS_ORIGIN`.

---

## 9. Despliegue y ejecución

### 9.1 Backend local

* Variables en `server/.env`.
* `npm run dev` (usa `nodemon index.js`).
* Base de datos accesible; `sync.js` disponible para `alter` en casos puntuales.

### 9.2 Backend en Vercel (serverless)

* `api/index.js` expone `handler(req,res)` que delega a `app`.
* `vercel.json` enruta **todo** a `api/index.js`.
* `config/db.js` ajusta SSL y pool si `VERCEL === "1"`.

### 9.3 Frontend

* Variables en `client/.env` con `VITE_API_URL`.
* `npm run dev` | `npm run build` | `npm run preview`.

---

## 10. Referencia de módulos (server)

* `app.js`: Express + middlewares + rutas + check DB por request.
* `routes/userRoutes.js`: `/register`, `/login`, `/getusers`, `/logout`.
* `routes/productRoutes.js`: `/getproducts`, `/getproduct/:id`, `/createproduct`, `/updateproduct/:id`, `/deleteproduct/:id`.
* `controllers/userController.js`: creación de usuario (con hash), login (firma JWT), logout (blacklist), getUsers.
* `controllers/productController.js`: CRUD producto, scoping por usuario autenticado en `create` y `getAll`.
* `middlewares/authMiddleware.js`: verificación JWT y blacklist.
* `middlewares/userValidator.js` y `productValidator.js`: reglas de validación.
* `middlewares/expressValidator.js`: respuesta 400 con array de mensajes.
* `models/*`: definiciones Sequelize y asociaciones.
* `config/db.js`: instancia Sequelize (SSL/pool según entorno).
* `sync.js`: autenticación + `sequelize.sync({ alter:true })`.

---

## 11. Referencia de módulos (client)

* `src/App.jsx`: rutas y `ToastContainer`.
* `src/pages/layouts/Public.jsx`: gate para no mostrar auth pages con sesión activa.
* `src/pages/layouts/Private.jsx`: layout con navbar, navegación y action logout.
* `src/pages/Login.jsx`: login y persistencia en Zustand.
* `src/pages/Register.jsx`: registro con manejo de errores de validación.
* `src/pages/Products.jsx`: tabla de productos con acciones editar/eliminar.
* `src/pages/EditProduct.jsx`: edición de producto por `:id`.
* `src/pages/CreateProduct.jsx`: alta de producto.
* `src/store/useStore.js`: estado global usuario + persist localStorage.
* `src/components/{Form,Input,Button}.jsx`: componentes UI.

---
