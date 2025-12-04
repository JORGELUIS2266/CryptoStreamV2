# ✅ CHECKLIST DE DESPLIEGUE - CryptoStream

## Fase 1: Modificaciones Locales

### Backend (✅ Completado)
- [x] Eliminar Pinata y Multer de index.js
- [x] Actualizar package.json
- [x] Actualizar modelo Video.js
- [x] Actualizar controlador videosController.js
- [x] Actualizar .env.example

### Frontend
- [x] Actualizar upload-manager.js (✅ Completado)
- [ ] **Modificar video.html** (⚠️ PENDIENTE - Ver CAMBIOS_PENDIENTES.md)
  - [ ] Cambio 1: Línea 539 (descripción)
  - [ ] Cambio 2: Líneas 545-566 (formulario)
  - [ ] Cambio 3: Línea 629 (selectedFile)
  - [ ] Cambio 4: Líneas 717-734 (handleFileSelect)
  - [ ] Cambio 5: Líneas 736-819 (uploadVideo)

---

## Fase 2: Prueba Local

### Preparar Backend
```bash
cd backend
npm install
npm start
```
- [ ] Backend corriendo en http://localhost:3000
- [ ] Ver mensaje "🚀 Servidor corriendo en puerto 3000"

### Probar Frontend
- [ ] Abrir frontend/public/index.html en navegador
- [ ] Crear cuenta con Passkey
- [ ] Ir a "Subir Video"
- [ ] Probar con URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
- [ ] Verificar que se guarda correctamente

---

## Fase 3: Configurar MongoDB Atlas

- [ ] Crear cuenta en https://www.mongodb.com/cloud/atlas
- [ ] Crear cluster gratuito (M0)
- [ ] Crear usuario de base de datos
- [ ] Agregar IP 0.0.0.0/0 a whitelist
- [ ] Copiar connection string
- [ ] Formato: `mongodb+srv://usuario:password@cluster.mongodb.net/cryptostream`

---

## Fase 4: Subir a GitHub

```bash
git add .
git commit -m "Actualizado para usar URLs en lugar de archivos"
git push origin main
```

- [ ] Código subido a GitHub
- [ ] Verificar que .env NO se subió (está en .gitignore)

---

## Fase 5: Desplegar Backend en Railway

1. [ ] Ir a https://railway.app/
2. [ ] Conectar con GitHub
3. [ ] New Project → Deploy from GitHub repo
4. [ ] Seleccionar repositorio CryptostreamV2
5. [ ] Configurar variables de entorno:
   - [ ] `MONGODB_URI` = (tu connection string de MongoDB)
   - [ ] `PORT` = 3000
6. [ ] Esperar despliegue
7. [ ] Settings → Networking → Generate Domain
8. [ ] Copiar URL (ej: https://cryptostream-production.up.railway.app)

---

## Fase 6: Actualizar Config del Frontend

Editar `frontend/public/js/config.js`:

```javascript
// Línea 7
BACKEND_URL_PROD: 'https://TU-URL-DE-RAILWAY.up.railway.app/api/videos',

// Línea 23
return 'https://TU-URL-DE-RAILWAY.up.railway.app/api';
```

- [ ] URL actualizada en config.js
- [ ] Commit y push:
```bash
git add .
git commit -m "Actualizar URL del backend"
git push
```

---

## Fase 7: Desplegar Frontend en Netlify

1. [ ] Ir a https://www.netlify.com/
2. [ ] Add new site → Import an existing project
3. [ ] Conectar con GitHub
4. [ ] Seleccionar repositorio
5. [ ] Configurar:
   - [ ] Base directory: `frontend`
   - [ ] Publish directory: `public`
6. [ ] Deploy site
7. [ ] Copiar URL (ej: https://cryptostream-app.netlify.app)

---

## Fase 8: Verificación Final

### Probar en Producción
- [ ] Abrir URL de Netlify
- [ ] Crear cuenta
- [ ] Importar clave privada de Stellar
- [ ] Subir video de prueba con URL
- [ ] Verificar que aparece en "Mis videos"
- [ ] Probar comprar un video
- [ ] Verificar transacción en Stellar

### Verificar Backend
- [ ] Abrir https://TU-URL-RAILWAY.up.railway.app/api/health
- [ ] Debe mostrar: `{"status":"ok","message":"CryptoStream Server is running 🚀"}`

### Verificar MongoDB
- [ ] Ir a MongoDB Atlas
- [ ] Browse Collections
- [ ] Verificar que hay videos guardados

---

## 🎉 ¡Listo!

Si todos los checkboxes están marcados, tu aplicación está desplegada y funcionando.

---

## 🆘 Troubleshooting

### Error: "Cannot connect to MongoDB"
- Verificar que MONGODB_URI está correcta en Railway
- Verificar que 0.0.0.0/0 está en whitelist de MongoDB

### Error: "CORS"
- Verificar que backend tiene `origin: '*'` en cors()

### Videos no se guardan
- Verificar que la URL del backend en config.js es correcta
- Abrir DevTools (F12) y ver errores en Console

### No puedo hacer login
- Verificar que el navegador soporta WebAuthn
- Probar en Chrome/Edge/Safari

---

## 📞 Contacto

Si tienes problemas, revisa:
1. GUIA_DESPLIEGUE_COMPLETA.md
2. CAMBIOS_PENDIENTES.md
3. README.md

---

**Última actualización**: 2025-12-04
