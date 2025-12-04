# 🚀 Guía Completa de Despliegue - CryptoStream V2

## ✅ Cambios Realizados

He modificado tu proyecto para que funcione SOLO con enlaces (URLs) de videos en lugar de subir archivos grandes. Esto resuelve el problema de almacenamiento que tenías.

### Archivos Modificados:

1. **backend/index.js** - Eliminado Pinata y Multer
2. **backend/package.json** - Eliminadas dependencias innecesarias
3. **backend/models/Video.js** - Eliminado campo ipfsHash
4. **backend/controllers/videosController.js** - Actualizado para validar URLs
5. **frontend/public/js/upload-manager.js** - Simplificado para validar URLs

### Cambios Pendientes en video.html:

Necesitas hacer estos cambios manualmente en `frontend/public/video.html`:

#### 1. Línea 539 - Cambiar descripción:
```html
<!-- ANTES -->
<p class="muted" style="margin-bottom: 2rem;">Sube tus videos a IPFS y monetízalos con Stellar.</p>

<!-- DESPUÉS -->
<p class="muted" style="margin-bottom: 2rem;">Comparte tus videos mediante enlaces y monetízalos con Stellar.</p>
```

#### 2. Líneas 545-566 - Reemplazar formulario de archivo por URL:
```html
<!-- ELIMINAR TODO ESTO (líneas 545-566) -->
<label>Archivo de Video</label>
<div style="border: 2px dashed #667eea; padding: 2rem; text-align: center; border-radius: 10px; margin-bottom: 1rem; cursor: pointer;"
    onclick="document.getElementById('videoFileInput').click()">
    <div style="font-size: 3rem; margin-bottom: 1rem;">📁</div>
    <p>Haz click para seleccionar o arrastra tu video aquí</p>
    <p class="muted" id="fileNameDisplay">Ningún archivo seleccionado</p>
</div>
<input type="file" id="videoFileInput" accept="video/*" style="display: none;"
    onchange="app.handleFileSelect(this)">

<!-- Progress Bar -->
<div id="uploadProgress" style="display: none; margin-bottom: 1.5rem;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
        <span>Subiendo a IPFS...</span>
        <span id="uploadPercent">0%</span>
    </div>
    <div style="height: 10px; background: rgba(255,255,255,0.1); border-radius: 5px; overflow: hidden;">
        <div id="progressBar" style="height: 100%; width: 0%; background: #27ae60; transition: width 0.3s;"></div>
    </div>
</div>

<!-- AGREGAR ESTO EN SU LUGAR -->
<label>URL del Video</label>
<div style="margin-bottom: 1rem;">
    <input id="videoUrlInput" class="input" placeholder="Ej: https://www.youtube.com/watch?v=... o https://vimeo.com/...">
    <p class="muted" style="margin-top: 0.5rem; font-size: 0.85rem;">
        💡 Puedes usar enlaces de YouTube, Vimeo, Google Drive, Dropbox, o cualquier URL pública de video
    </p>
</div>
```

#### 3. Líneas 717-734 - ELIMINAR función handleFileSelect completa:
```javascript
// ELIMINAR TODA ESTA FUNCIÓN
handleFileSelect(input) {
    const file = input.files[0];
    if (!file) return;

    try {
        UploadManager.validateVideoFile(file);
        this.selectedFile = file;
        document.getElementById('fileNameDisplay').textContent = `${file.name} (${UploadManager.formatFileSize(file.size)})`;
        document.getElementById('fileNameDisplay').style.color = '#27ae60';
        document.getElementById('fileNameDisplay').style.fontWeight = 'bold';
    } catch (error) {
        UIController.notify(error.message, 'error');
        input.value = '';
        this.selectedFile = null;
        document.getElementById('fileNameDisplay').textContent = 'Ningún archivo seleccionado';
        document.getElementById('fileNameDisplay').style.color = '#bbb';
    }
},
```

#### 4. Líneas 736-819 - REEMPLAZAR función uploadVideo:
```javascript
// REEMPLAZAR TODA LA FUNCIÓN uploadVideo CON ESTA:
async uploadVideo() {
    const title = document.getElementById('videoTitleInput').value.trim();
    const videoUrl = document.getElementById('videoUrlInput').value.trim();
    const category = document.getElementById('videoCategoryInput').value.trim();
    const reward = document.getElementById('videoRewardInput').value.trim();
    const emoji = document.getElementById('videoEmojiInput').value.trim();
    const isReel = document.getElementById('isReelInput').checked;

    if (!title) {
        UIController.notify('Ingresa un título para el video', 'error');
        return;
    }

    if (!videoUrl) {
        UIController.notify('Ingresa la URL del video', 'error');
        return;
    }

    // Validar que sea una URL válida
    try {
        new URL(videoUrl);
    } catch (e) {
        UIController.notify('La URL ingresada no es válida', 'error');
        return;
    }

    document.getElementById('btnUpload').disabled = true;
    document.getElementById('btnUpload').style.opacity = '0.5';

    try {
        UIController.notify('📤 Guardando video...', 'info');

        // Guardar metadata en backend
        const videoData = {
            url: videoUrl,
            title: title,
            category: category || 'General',
            reward: parseFloat(reward) || 0,
            emoji: emoji || '🎬',
            isReel: isReel,
            ownerPublicKey: this.user.publicKey,
            duration: 0
        };

        const response = await fetch(`${Config.getVideosUrl()}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(videoData)
        });

        if (!response.ok) throw new Error('Error al guardar video');

        UIController.notify('🎉 ¡Video publicado exitosamente!', 'success');

        // Limpiar formulario
        document.getElementById('videoUrlInput').value = '';
        document.getElementById('videoTitleInput').value = '';
        document.getElementById('videoCategoryInput').value = '';
        document.getElementById('videoRewardInput').value = '';
        document.getElementById('videoEmojiInput').value = '🎬';
        document.getElementById('isReelInput').checked = false;
        document.getElementById('btnUpload').disabled = false;
        document.getElementById('btnUpload').style.opacity = '1';

        // Recargar videos
        await VideoManager.loadVideos(Config.getVideosUrl());
        UIController.renderVideosGrid(VideoManager);
        UIController.renderReels(VideoManager);
        UIController.renderMyVideosTable(VideoManager);
        UIController.updateStats(VideoManager);

        // Ir a la pestaña de mis videos
        document.querySelector('[data-section="myVideos"]').click();

    } catch (error) {
        console.error('Error al publicar video:', error);
        UIController.notify('Error al publicar video', 'error');
        document.getElementById('btnUpload').disabled = false;
        document.getElementById('btnUpload').style.opacity = '1';
    }
},
```

#### 5. Línea 629 - ELIMINAR la línea:
```javascript
selectedFile: null,  // <-- ELIMINAR ESTA LÍNEA
```

---

## 📋 Pasos para Desplegar

### Paso 1: Actualizar video.html
Abre `frontend/public/video.html` y haz los 5 cambios listados arriba.

### Paso 2: Reinstalar dependencias del backend
```bash
cd backend
npm install
```

### Paso 3: Probar localmente

#### Terminal 1 - Backend:
```bash
cd backend
npm start
```

#### Terminal 2 - Frontend:
```bash
cd frontend/public
# Abre index.html en tu navegador
```

Prueba subir un video usando una URL de YouTube o cualquier enlace público.

### Paso 4: Subir a GitHub
```bash
git add .
git commit -m "Actualizado para usar URLs en lugar de archivos"
git push origin main
```

---

## 🚀 Despliegue a Railway (Backend)

1. Ve a [Railway.app](https://railway.app/) e inicia sesión con GitHub
2. Click en **"New Project"** → **"Deploy from GitHub repo"**
3. Selecciona tu repositorio `CryptostreamV2`
4. Railway detectará el backend automáticamente
5. **IMPORTANTE**: Configura las Variables de Entorno:
   - Ve a **Variables** en el dashboard
   - Agrega:
     - `MONGODB_URI`: Tu conexión de MongoDB Atlas (ver abajo)
     - `PORT`: `3000`
6. Ve a **Settings** → **Networking** y genera un **Domain**
7. **Copia la URL** (ej: `https://cryptostream-production.up.railway.app`)

---

## 🗄️ Configurar MongoDB Atlas

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta gratuita
3. Crea un **Cluster** (Free Tier M0)
4. En **Database Access**, crea un usuario con contraseña
5. En **Network Access**, agrega `0.0.0.0/0` (permitir todas las IPs)
6. Click en **Connect** → **Connect your application**
7. Copia la **Connection String** (ej: `mongodb+srv://usuario:password@cluster.mongodb.net/cryptostream`)
8. Pega esta URL en Railway como variable `MONGODB_URI`

---

## 🌐 Despliegue a Netlify (Frontend)

1. Ve a [Netlify.com](https://www.netlify.com/) e inicia sesión
2. Click en **"Add new site"** → **"Import an existing project"**
3. Selecciona **GitHub** y tu repositorio
4. En **Build settings**:
   - **Base directory**: `frontend`
   - **Publish directory**: `public`
5. Click en **"Deploy site"**
6. Netlify te dará una URL (ej: `https://cryptostream-app.netlify.app`)

---

## ⚙️ Actualizar URL del Backend en el Frontend

1. Abre `frontend/public/js/config.js`
2. En la línea 7, actualiza con tu URL de Railway:
```javascript
BACKEND_URL_PROD: 'https://TU-URL-DE-RAILWAY.up.railway.app/api/videos',
```
3. En la línea 23, actualiza también:
```javascript
return 'https://TU-URL-DE-RAILWAY.up.railway.app/api';
```
4. Guarda, haz commit y push:
```bash
git add .
git commit -m "Actualizar URL del backend"
git push
```

Netlify se actualizará automáticamente.

---

## ✅ Verificación Final

1. Abre tu URL de Netlify
2. Crea una cuenta o inicia sesión
3. Ve a "Subir Video"
4. Ingresa:
   - Título: "Video de Prueba"
   - URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - Categoría: "Música"
   - Precio: 1
5. Click en "Subir y Publicar"
6. Deberías ver el video en "Mis videos"

---

## 🎉 ¡Listo!

Tu aplicación ahora está desplegada y funcionando con:
- ✅ Backend en Railway
- ✅ Frontend en Netlify
- ✅ Base de datos en MongoDB Atlas
- ✅ Sistema de videos por URL (sin límites de almacenamiento)
- ✅ Pagos en Stellar funcionando

---

## 📝 Notas Importantes

1. **URLs de videos**: Ahora los usuarios solo ingresan enlaces. Pueden usar:
   - YouTube: `https://www.youtube.com/watch?v=...`
   - Vimeo: `https://vimeo.com/...`
   - Google Drive: `https://drive.google.com/file/d/...`
   - Dropbox: `https://www.dropbox.com/s/...`
   - Cualquier URL pública de video

2. **MongoDB**: Asegúrate de que la conexión esté activa en Railway

3. **Stellar**: Actualmente está en TESTNET. Para producción, cambia en `config.js`:
   ```javascript
   NETWORK: 'MAINNET'
   ```

4. **Costos**:
   - Railway: Gratis hasta cierto límite
   - Netlify: Gratis
   - MongoDB Atlas: Gratis (M0 Tier)

---

¿Necesitas ayuda con algún paso? ¡Pregúntame!
