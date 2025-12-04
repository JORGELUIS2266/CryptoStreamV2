# ✅ APLICACIÓN CORRIENDO LOCALMENTE

## 🎉 ¡La aplicación está funcionando!

### Estado Actual:

✅ **Backend:** Corriendo en http://localhost:3000  
✅ **Frontend:** Abierto en el navegador  
✅ **Modo:** Desarrollo (datos en memoria)

---

## 🌐 URLs Disponibles:

- **Frontend:** `file:///c:/Users/User/Videos/CryptostreamV2/frontend/public/index.html`
- **Backend API:** http://localhost:3000/api/videos
- **Health Check:** http://localhost:3000/api/health

---

## 📝 Cómo Usar la Aplicación:

### 1. **Crear una Cuenta**

En la página de login que se abrió:

1. Haz clic en **"Crear cuenta"**
2. Ingresa tu nombre (ej: "Jorge")
3. Elige un avatar (emoji)
4. Haz clic en **"Crear cuenta"**

> 💡 **Nota:** El sistema usa Passkeys (autenticación biométrica). Si tu navegador lo soporta, te pedirá usar tu huella o FaceID.

---

### 2. **Configurar tu Billetera Stellar**

Una vez dentro del dashboard:

1. Ve a la pestaña **"Mi cuenta"**
2. En la sección "Billetera", ingresa tu **clave privada de Stellar**
   - Si no tienes una, puedes crear una en: https://laboratory.stellar.org/#account-creator?network=test
   - Usa la **Testnet** para pruebas
3. Haz clic en **"Importar Clave"**

> ⚠️ **Importante:** La clave se guarda encriptada en tu navegador, nunca se envía al servidor.

---

### 3. **Subir un Video**

1. Ve a la pestaña **"➕ Subir Video"**
2. Llena el formulario:
   - **Título:** Ej: "Tutorial de Stellar"
   - **URL del Video:** Usa una URL pública como:
     - YouTube: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
     - Vimeo: `https://vimeo.com/123456789`
     - Cualquier enlace público
   - **Categoría:** Ej: "Educación"
   - **Precio (XLM):** Ej: 1
   - **Emoji:** Ej: 🎬
3. Haz clic en **"🚀 Subir y Publicar"**

> ✅ El video se guardará y aparecerá en "Mis videos"

---

### 4. **Ver Videos Disponibles**

1. Ve a la pestaña **"Dashboard"**
2. Verás todos los videos publicados
3. Haz clic en un video para:
   - **Ver gratis** (si es tuyo)
   - **Comprar** (si es de otro usuario)

---

### 5. **Comprar un Video**

1. Haz clic en un video que no sea tuyo
2. Confirma la compra
3. El sistema procesará el pago en Stellar
4. Una vez pagado, el video se abrirá automáticamente

---

## 🔧 Características Disponibles:

### ✅ Funcionando:
- ✅ Crear cuenta con Passkeys
- ✅ Subir videos con URLs
- ✅ Ver videos propios
- ✅ Lista de videos disponibles
- ✅ Categorías y precios
- ✅ Reels (videos verticales)
- ✅ Compartir en redes sociales

### ⚠️ Requiere Configuración:
- ⚠️ **Pagos con Stellar:** Necesitas importar tu clave privada
- ⚠️ **Persistencia:** Los datos están en memoria (se pierden al reiniciar)
  - Para persistencia, configura MongoDB (ver GUIA_DESPLIEGUE_COMPLETA.md)

---

## 🧪 Pruebas Recomendadas:

### Prueba 1: Subir un Video
```
Título: Mi Primer Video
URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
Categoría: Música
Precio: 1 XLM
```

### Prueba 2: Subir un Reel
```
Título: Short Video
URL: https://www.youtube.com/shorts/XXXXXXXXX
Categoría: Entretenimiento
Precio: 0.5 XLM
☑️ Marcar "Es un Reel"
```

### Prueba 3: Ver Estadísticas
- Ve a "Dashboard" y verás:
  - Videos Vistos
  - Total Ganado
  - Videos Disponibles

---

## 🛑 Detener la Aplicación:

Para detener el backend:
1. Ve a la terminal donde está corriendo
2. Presiona `Ctrl + C`

---

## 🔄 Reiniciar la Aplicación:

```bash
# Terminal 1 - Backend
cd backend
npm start

# Navegador - Frontend
# Abre: frontend/public/index.html
```

---

## 📊 Datos de Prueba:

Como estás en **modo desarrollo** (sin MongoDB), los datos se guardan en memoria:

- ✅ Puedes subir videos
- ✅ Puedes ver videos
- ✅ Puedes eliminar videos
- ⚠️ Los datos se pierden al reiniciar el backend

Para **persistencia permanente**, configura MongoDB Atlas (ver GUIA_DESPLIEGUE_COMPLETA.md)

---

## 🐛 Solución de Problemas:

### Error: "Cannot connect to backend"
- Verifica que el backend esté corriendo en http://localhost:3000
- Abre http://localhost:3000/api/health en tu navegador
- Debería mostrar: `{"status":"ok",...}`

### Error: "No puedo subir videos"
- Verifica que la URL sea válida (debe empezar con http:// o https://)
- Abre DevTools (F12) y mira la consola para ver errores

### Error: "No puedo hacer pagos"
- Necesitas importar tu clave privada de Stellar
- Ve a "Mi cuenta" → "Billetera" → Importar clave
- Usa una cuenta de Testnet para pruebas

---

## 💡 Próximos Pasos:

1. ✅ **Probar la aplicación localmente** (estás aquí)
2. ⏭️ **Modificar video.html** (ver CAMBIOS_PENDIENTES.md)
3. ⏭️ **Configurar MongoDB Atlas** (para persistencia)
4. ⏭️ **Desplegar a producción** (ver GUIA_DESPLIEGUE_COMPLETA.md)

---

## 📞 Ayuda:

Si tienes problemas:
- Revisa la consola del navegador (F12)
- Revisa la terminal del backend
- Lee COMANDOS_RAPIDOS.md para comandos útiles

---

¡Disfruta probando tu aplicación! 🎉
