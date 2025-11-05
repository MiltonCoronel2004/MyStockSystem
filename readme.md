# MyStockSystem 

Desarrolladores: [miltoncoronel2004](https://github.com/MiltonCoronel2004), [zjohnsan](https://github.com/zjohnsan), [IbzJuanma](https://github.com/IbzJuanma)

## Instalación del Servidor

Backend para el sistema de gestión de inventario y productos **MyStockSystem**. Desarrollado en Node.js con Express, utiliza Sequelize para la gestión de base de datos y JWT para autenticación.

---

## Instalación

1. **Clona el repositorio:**
   ```sh
   git clone https://github.com/MiltonCoronel2004/MyStockSystem.git
   cd MyStockSystem/server
   ```

2. **Instala las dependencias:**
   ```sh
   npm install
   ```

3. **Configura el archivo `.env`:**
   - Copia el archivo de ejemplo:
     ```sh
     cp .env.example .env
     ```
   - Edita `.env` y coloca tus credenciales de base de datos y JWT:
     ```
     # === Base de Datos ===
     DB_USER=
     DB_PASS=
     DB_HOST=
     DB_PORT=
     DB_NAME=
     DB_DIALECT=
    
     # === Configuración CORS ===
     CORS_ORIGIN=*
    
     # === Clave secreta JWT ===
     SECRET=
     ```

4. **Sincroniza la base de datos (Solo si usas una DB en la nube):**
   ```sh
   node sync.js
   ```

5. **Inicia el servidor:**
   ```sh
   npm run dev
   ```

---

## Dependencias utilizadas

- **Express** (`express`): Framework principal para el servidor HTTP.
- **Sequelize** (`sequelize`, `mysql2`): ORM para la gestión de base de datos MySQL.
- **dotenv** (`dotenv`): Manejo de variables de entorno.
- **jsonwebtoken** (`jsonwebtoken`): Autenticación basada en JWT.
- **bcryptjs** (`bcryptjs`): Hashing de contraseñas.
- **express-validator** (`express-validator`): Validación de datos en rutas.
- **cors** (`cors`): Permitir solicitudes desde otros orígenes.
- **Nodemon** (`nodemon`): Reiniciar el servidor automaticamente.


---

## Notas

- El backend corre por defecto en `http://localhost:3000`.
- Asegúrate de que la base de datos esté creada y accesible.
- Para producción, configura correctamente las variables de entorno y utiliza un entorno seguro para el secreto JWT.





## Instalación del Cliente

Frontend para el sistema de gestión de inventario y productos **MyStockSystem**. Desarrollado en React, utiliza Vite como bundler y Zustand para el manejo de estado global.

---


1. **Clona el repositorio:**
   ```sh
   git clone https://github.com/MiltonCoronel2004/MyStockSystem.git
   cd MyStockSystem/client
   ```

2. **Instala las dependencias:**
   ```sh
   npm install
   ```

3. **Configura el archivo `.env`:**
   - Copia el archivo de ejemplo:
     ```sh
     cp .env.example .env
     ```
   - Edita `.env` y coloca la URL de tu API backend:
     ```
     VITE_API_URL=http://localhost:3000
     ```

4. **Inicia el proyecto en modo desarrollo:**
   ```sh
   npm run dev
   ```

---

## Dependencias utilizadas

- **React** (`react`, `react-dom`): Librería principal para construir la interfaz de usuario.
- **Vite** (`vite`): Bundler y servidor de desarrollo rápido.
- **Zustand** (`zustand`): Manejo de estado global.
- **TailwindCSS** (`tailwindcss`, `@tailwindcss/vite`): Utilidades CSS para estilos rápidos y responsivos.
- **React Router** (`react-router`): Enrutamiento SPA.
- **React Toastify** (`react-toastify`): Notificaciones y mensajes emergentes.
- **Lucide React** (`lucide-react`): Iconos SVG modernos.

---

## Configuración del archivo `.env`

El archivo `.env` debe contener la siguiente variable:

```env
VITE_API_URL=http://localhost:3000
```

- **VITE_API_URL:** URL base del backend (Express API). Cambia el valor según tu entorno (local, producción, etc).

---

## Notas

- El frontend corre por defecto en `http://localhost:5173`.
- Asegúrate de que el backend esté corriendo y accesible desde la URL configurada en `VITE_API_URL`.
- Para producción, ejecuta `npm run build` y sirve la carpeta `dist`.

---

### Rutas del Backend

| Ruta               | Método | Funcionalidad                                                                 |
|--------------------|--------|-------------------------------------------------------------------------------|
| `/`                | GET    | Comprobación/estado de la API (respuesta: "API MyStockSystem online").        |
| `/register`        | POST   | Registrar nuevo usuario (valida datos, crea usuario).                         |
| `/login`           | POST   | Iniciar sesión; devuelve JWT (Bearer token).                                  |
| `/getusers`        | GET    | Obtener lista de usuarios (requiere autenticación).                           |
| `/logout`          | POST   | Cerrar sesión; añade token a blacklist (requiere autenticación).              |
| `/getproducts`     | GET    | Obtener todos los productos del usuario autenticado.                          |
| `/getproduct/:id`  | GET    | Obtener un producto por id (requiere autenticación).                          |
| `/createproduct`   | POST   | Crear un producto asociado al usuario (validación + auth).                    |
| `/updateproduct/:id` | PUT  | Actualizar un producto por id (validación parcial + auth).                    |
| `/deleteproduct/:id` | DELETE | Eliminar un producto por id (requiere autenticación).                      |
