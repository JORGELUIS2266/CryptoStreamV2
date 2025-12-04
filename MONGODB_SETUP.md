# 🍃 Guía de Configuración de MongoDB Atlas (Base de Datos)

Para que tus videos no se borren nunca, usaremos MongoDB Atlas (es gratis y profesional).

## Paso 1: Crear Cuenta
1.  Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2.  Regístrate (puedes usar Google).
3.  Completa el cuestionario rápido (puedes poner "Learning" o "Personal Project").

## Paso 2: Crear Cluster (Servidor)
1.  Elige la opción **M0 FREE** (es la columna de la derecha, la gratuita).
2.  Selecciona un proveedor (AWS es bueno) y una región cercana (ej: N. Virginia).
3.  Dale nombre a tu cluster (ej: "Cluster0") y click en **"Create"**.

## Paso 3: Crear Usuario de Base de Datos
1.  Te pedirá crear un usuario.
2.  **Username**: `admin` (o lo que quieras).
3.  **Password**: Escribe una contraseña segura (¡y guárdala!).
4.  Click en **"Create User"**.

## Paso 4: Permitir Conexiones (IP)
1.  Busca la sección "IP Access List".
2.  Click en **"Add IP Address"**.
3.  Selecciona **"Allow Access from Anywhere"** (0.0.0.0/0).
    *   *Esto es necesario para que Railway pueda conectarse.*
4.  Click en **"Confirm"**.

## Paso 5: Obtener Link de Conexión
1.  Ve al dashboard principal ("Database").
2.  Click en el botón **"Connect"** (al lado de tu Cluster).
3.  Elige **"Drivers"**.
4.  Verás una cadena de texto parecida a esta:
    `mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
5.  **Copia esa cadena**.

## Paso 6: Configurar en Railway
1.  Ve a tu proyecto en **Railway**.
2.  Ve a la pestaña **"Variables"**.
3.  Agrega una nueva variable:
    *   **Nombre**: `MONGODB_URI`
    *   **Valor**: Pega la cadena que copiaste en el paso 5.
    *   **IMPORTANTE**: Reemplaza `<password>` con tu contraseña real (sin los símbolos `< >`).
4.  Railway reiniciará tu servidor automáticamente.

¡Listo! Ahora tus videos se guardarán para siempre en la nube. ☁️💾
