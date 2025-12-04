# 🎯 COMANDOS RÁPIDOS - CryptoStream

## 1️⃣ Probar Localmente

### Instalar dependencias del backend
```bash
cd backend
npm install
cd ..
```

### Iniciar backend
```bash
cd backend
npm start
```

Deberías ver:
```
🚀 Servidor corriendo en puerto 3000
🎬 API de videos: http://localhost:3000/api/videos
💚 Health check: http://localhost:3000/api/health
```

### Abrir frontend
- Abre `frontend/public/index.html` en tu navegador
- O usa Live Server si tienes VS Code

---

## 2️⃣ Subir a GitHub

### Primera vez
```bash
git init
git add .
git commit -m "Actualizado para usar URLs en lugar de archivos"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/CryptostreamV2.git
git push -u origin main
```

### Actualizaciones posteriores
```bash
git add .
git commit -m "Descripción de cambios"
git push
```

---

## 3️⃣ Actualizar URL del Backend (Después de Railway)

Edita `frontend/public/js/config.js`:

```javascript
// Línea 7
BACKEND_URL_PROD: 'https://TU-URL-RAILWAY.up.railway.app/api/videos',

// Línea 23
return 'https://TU-URL-RAILWAY.up.railway.app/api';
```

Luego:
```bash
git add .
git commit -m "Actualizar URL del backend"
git push
```

---

## 4️⃣ Variables de Entorno para Railway

Copia y pega estas en Railway → Variables:

```
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/cryptostream
PORT=3000
STELLAR_NETWORK=TESTNET
```

---

## 5️⃣ Verificar Despliegue

### Backend (Railway)
```bash
# Reemplaza con tu URL de Railway
curl https://TU-URL-RAILWAY.up.railway.app/api/health
```

Debería responder:
```json
{
  "status": "ok",
  "message": "CryptoStream Server is running 🚀",
  "timestamp": "2025-12-04T..."
}
```

### Frontend (Netlify)
Abre tu URL de Netlify en el navegador y prueba:
1. Crear cuenta
2. Subir video con URL
3. Ver video en "Mis videos"

---

## 🔧 Comandos de Desarrollo

### Ver logs del backend
```bash
cd backend
npm start
# Los logs aparecerán en la consola
```

### Limpiar node_modules
```bash
cd backend
rm -rf node_modules
npm install
```

### Ver versión de Node
```bash
node --version
# Debería ser v14 o superior
```

---

## 📝 Comandos Git Útiles

### Ver estado
```bash
git status
```

### Ver cambios
```bash
git diff
```

### Deshacer cambios (antes de commit)
```bash
git checkout -- archivo.js
```

### Ver historial
```bash
git log --oneline
```

---

## 🗄️ MongoDB Atlas - Connection String

Formato:
```
mongodb+srv://USUARIO:PASSWORD@CLUSTER.mongodb.net/NOMBRE_DB?retryWrites=true&w=majority
```

Ejemplo:
```
mongodb+srv://cryptostream:MiPassword123@cluster0.abc123.mongodb.net/cryptostream?retryWrites=true&w=majority
```

⚠️ **Importante**: 
- Reemplaza `USUARIO` con tu usuario de MongoDB
- Reemplaza `PASSWORD` con tu contraseña
- Reemplaza `CLUSTER` con tu cluster ID
- Reemplaza `NOMBRE_DB` con `cryptostream`

---

## 🌐 URLs Importantes

### Desarrollo
- Backend: http://localhost:3000
- Frontend: Abre `frontend/public/index.html`
- Health Check: http://localhost:3000/api/health

### Producción (Reemplaza con tus URLs)
- Backend: https://TU-URL-RAILWAY.up.railway.app
- Frontend: https://TU-SITIO.netlify.app
- MongoDB: https://cloud.mongodb.com

---

## 🧪 Probar API con curl

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Obtener videos
```bash
curl http://localhost:3000/api/videos
```

### Agregar video (ejemplo)
```bash
curl -X POST http://localhost:3000/api/videos/add \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Video de Prueba",
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "category": "Música",
    "reward": 1,
    "emoji": "🎵",
    "isReel": false,
    "ownerPublicKey": "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "duration": 0
  }'
```

---

## 🚨 Solución Rápida de Problemas

### Error: "Cannot find module"
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID NUMERO_PID /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Error: "MongoDB connection failed"
1. Verifica que MONGODB_URI está correcta
2. Verifica que tu IP está en whitelist (0.0.0.0/0)
3. Verifica usuario y contraseña

---

## 📦 Estructura de Carpetas

```
CryptostreamV2/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── .env              ← Crear este archivo
│   ├── .env.example      ← Plantilla
│   ├── index.js
│   └── package.json
├── frontend/
│   └── public/
│       ├── css/
│       ├── js/
│       │   └── config.js ← Actualizar URL aquí
│       ├── index.html
│       └── video.html    ← Modificar este archivo
├── RESUMEN_EJECUTIVO.md
├── CAMBIOS_PENDIENTES.md
├── GUIA_DESPLIEGUE_COMPLETA.md
└── CHECKLIST_DESPLIEGUE.md
```

---

## ✅ Checklist Rápido

Antes de desplegar, verifica:

- [ ] `video.html` modificado
- [ ] `npm install` ejecutado en backend
- [ ] Backend funciona localmente
- [ ] Frontend funciona localmente
- [ ] MongoDB Atlas configurado
- [ ] Código subido a GitHub
- [ ] `.env` NO está en GitHub

---

¿Listo para desplegar? Sigue `GUIA_DESPLIEGUE_COMPLETA.md`
