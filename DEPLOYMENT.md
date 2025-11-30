# 🚀 Guía de Despliegue (Deployment) - CryptoStream

¡Felicidades! Tu dApp está lista para salir al mundo. Sigue estos pasos para desplegar el Backend y el Frontend.

## 1. Preparación (Ya realizada)
Hemos creado un archivo `.gitignore` para evitar subir archivos sensibles y configurado el servidor para la nube.

## 2. Subir código a GitHub
Para desplegar en Railway y Netlify, lo más fácil es tener tu código en GitHub.

1.  Crea un **nuevo repositorio** en [GitHub](https://github.com/new).
2.  Abre tu terminal en la carpeta del proyecto (`c:\Users\User\Documents\Cryptostream`) y ejecuta:
    ```bash
    git init
    git add .
    git commit -m "Initial deploy"
    git branch -M main
    git remote add origin <TU_URL_DEL_REPO_GITHUB>
    git push -u origin main
    ```

## 3. Desplegar Backend (Railway)
Railway alojará tu servidor Node.js y lo mantendrá activo 24/7.

1.  Ve a [Railway.app](https://railway.app/) e inicia sesión con GitHub.
2.  Click en **"New Project"** -> **"Deploy from GitHub repo"**.
3.  Selecciona tu repositorio `Cryptostream`.
4.  **IMPORTANTE**: Configura las Variables de Entorno.
    *   En el dashboard de tu proyecto en Railway, ve a la pestaña **"Variables"**.
    *   Agrega las siguientes variables (copia los valores de tu archivo `.env` local):
        *   `PINATA_API_KEY`: (Tu API Key)
        *   `PINATA_SECRET_API_KEY`: (Tu Secret Key)
        *   `PORT`: `3000` (Opcional, Railway lo asigna solo, pero bueno tenerlo).
5.  Railway detectará automáticamente que es un proyecto Node.js y lo desplegará.
6.  Una vez desplegado, ve a **"Settings"** -> **"Networking"** y genera un **Domain** (ej: `cryptostream-production.up.railway.app`).
    *   **¡Copia esta URL!** La necesitarás para el frontend.

## 4. Configurar Frontend
Antes de desplegar el frontend, necesitamos decirle dónde está el nuevo backend en la nube.

1.  Abre el archivo `frontend/public/js/config.js` en tu editor.
2.  Busca la línea:
    ```javascript
    const BACKEND_URL_PROD = 'https://tu-backend-en-railway.app'; 
    ```
3.  Reemplaza esa URL con la que copiaste de Railway (paso 3.6).
4.  Guarda el archivo, haz commit y push de nuevo:
    ```bash
    git add .
    git commit -m "Update backend URL"
    git push
    ```

## 5. Desplegar Frontend (Netlify)
Netlify alojará tu página web (HTML/CSS/JS).

1.  Ve a [Netlify.com](https://www.netlify.com/) e inicia sesión.
2.  Click en **"Add new site"** -> **"Import an existing project"**.
3.  Selecciona **GitHub** y busca tu repositorio `Cryptostream`.
4.  En "Build settings":
    *   **Base directory**: `frontend` (¡Importante! Porque tu frontend está en esa carpeta).
    *   **Publish directory**: `public` (o `frontend/public`).
5.  Click en **"Deploy site"**.
6.  Netlify te dará una URL (ej: `https://cryptostream-app.netlify.app`).

## 6. ¡Listo!
Entra a tu URL de Netlify. Tu aplicación ahora vive en internet.
- Los videos se suben a IPFS.
- La metadata se guarda en Railway.
- Los pagos ocurren en Stellar Testnet.

¡Comparte tu enlace con el mundo! 🌍
