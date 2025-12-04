# 📺 CryptoStream - Plataforma de Videos Descentralizada

> 🚀 **¿Primera vez aquí?** Lee [INDICE.md](INDICE.md) para empezar  
> 📋 **¿Listo para desplegar?** Sigue [GUIA_DESPLIEGUE_COMPLETA.md](GUIA_DESPLIEGUE_COMPLETA.md)  
> ⚠️ **¿Necesitas modificar código?** Ver [CAMBIOS_PENDIENTES.md](CAMBIOS_PENDIENTES.md)

Una plataforma de videos monetizada con **Stellar** y almacenamiento mediante enlaces.

## 🌟 Características

- ✅ **Autenticación sin contraseñas** con Passkeys (biométrico)
- ✅ **Pagos con Stellar** (XLM)
- ✅ **Videos mediante URLs** (YouTube, Vimeo, Google Drive, etc.)
- ✅ **Base de datos MongoDB** para metadata
- ✅ **Reels** (videos verticales)
- ✅ **Compartir en redes sociales**

## 🚀 Tecnologías

### Backend
- Node.js + Express
- MongoDB (Mongoose)
- Stellar SDK
- CORS habilitado

### Frontend
- HTML5 + CSS3 + JavaScript vanilla
- Stellar SDK
- WebAuthn (Passkeys)
- Responsive design

## 📦 Instalación Local

### 1. Clonar repositorio
```bash
git clone https://github.com/TU_USUARIO/CryptostreamV2.git
cd CryptostreamV2
```

### 2. Configurar Backend
```bash
cd backend
npm install
```

Crea un archivo `.env` basado en `.env.example`:
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/cryptostream
PORT=3000
STELLAR_NETWORK=TESTNET
```

### 3. Iniciar Backend
```bash
npm start
```

### 4. Abrir Frontend
Abre `frontend/public/index.html` en tu navegador.

## 🌐 Despliegue

Ver la guía completa en `GUIA_DESPLIEGUE_COMPLETA.md`

### Railway (Backend)
1. Conecta tu repositorio de GitHub
2. Configura variables de entorno
3. Despliega automáticamente

### Netlify (Frontend)
1. Base directory: `frontend`
2. Publish directory: `public`
3. Despliega automáticamente

## 📖 Uso

### Para Usuarios
1. Crea una cuenta con Passkey (huella/FaceID)
2. Importa tu clave privada de Stellar
3. Navega y compra videos con XLM

### Para Creadores
1. Ve a "Subir Video"
2. Ingresa el título y la URL del video
3. Establece un precio en XLM
4. Publica y monetiza

## 🔐 Seguridad

- Las claves privadas se guardan **encriptadas** en el navegador
- Autenticación biométrica con **WebAuthn**
- Transacciones firmadas localmente
- Sin servidores centralizados para claves

## 🛠️ Estructura del Proyecto

```
CryptostreamV2/
├── backend/
│   ├── config/          # Configuración de DB
│   ├── controllers/     # Lógica de negocio
│   ├── models/          # Modelos de MongoDB
│   ├── routes/          # Rutas de API
│   └── index.js         # Servidor principal
├── frontend/
│   └── public/
│       ├── css/         # Estilos
│       ├── js/          # Lógica del cliente
│       ├── index.html   # Página de login
│       └── video.html   # Dashboard principal
└── contract-stellar/    # Contratos inteligentes (futuro)
```

## 🌍 Variables de Entorno

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://...
PORT=3000
STELLAR_NETWORK=TESTNET
```

### Frontend (config.js)
```javascript
BACKEND_URL_PROD: 'https://tu-backend.railway.app/api/videos'
NETWORK: 'TESTNET'
```

## 📝 API Endpoints

### Videos
- `GET /api/videos` - Obtener todos los videos
- `POST /api/videos/add` - Agregar nuevo video
- `DELETE /api/videos/:id` - Eliminar video
- `GET /api/videos/rewards` - Obtener recompensas

### Health Check
- `GET /api/health` - Estado del servidor

## 🎨 Personalización

### Cambiar Red de Stellar
En `frontend/public/js/config.js`:
```javascript
NETWORK: 'MAINNET'  // Cambiar de TESTNET a MAINNET
```

### Agregar Nuevas Categorías
En `video.html`, modifica el input de categoría o crea un select.

## 🐛 Troubleshooting

### Error de CORS
Asegúrate de que el backend tenga configurado:
```javascript
app.use(cors({ origin: '*' }));
```

### MongoDB no conecta
Verifica que:
1. La IP esté en la whitelist de MongoDB Atlas
2. El usuario y contraseña sean correctos
3. La URL de conexión esté bien formada

### Videos no se guardan
Verifica que:
1. La URL sea válida (http:// o https://)
2. El backend esté corriendo
3. MongoDB esté conectado

## 📄 Licencia

MIT License - Ver `LICENSE` para más detalles

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas:
1. Revisa `GUIA_DESPLIEGUE_COMPLETA.md`
2. Abre un Issue en GitHub
3. Contacta al equipo

## 🎉 Créditos

Desarrollado con ❤️ usando Stellar y MongoDB

---

**Nota**: Este proyecto está en fase de desarrollo. Úsalo bajo tu propio riesgo en producción.
