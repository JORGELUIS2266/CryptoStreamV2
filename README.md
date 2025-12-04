# 🎬 CryptoStream - dApp de Videos con Stellar

Una aplicación descentralizada (dApp) para compartir y monetizar videos usando la blockchain de Stellar.

## ✨ Características

- 💰 **Pagos Reales en Stellar**: Transacciones verificables en Stellar Testnet
- 🔐 **Autenticación con Passkey**: Login biométrico (huella/FaceID)
- 🎬 **Videos Premium**: Sistema de pago por video con blockchain
- 📱 **Reels Verticales**: Formato de videos cortos
- 🌐 **Descentralizado**: Sin intermediarios, pagos directos entre usuarios
- 🔑 **Firma con Clave Privada**: Control total de tus fondos

## 🏗️ Arquitectura

### Frontend (Netlify)
- HTML/CSS/JavaScript puro
- Módulos separados para mejor organización
- Stellar SDK para interacción con blockchain

### Backend (Railway/Render)
- Node.js + Express
- API REST para metadata de videos
- Persistencia en archivo JSON

### Blockchain
- Stellar Testnet para transacciones
- Pagos directos entre usuarios
- Verificación en Stellar Explorer

## 📁 Estructura del Proyecto

```
Cryptostream/
├── frontend/
│   └── public/
│       ├── index.html              # Login/Registro
│       ├── video.html              # Dashboard principal
│       └── js/
│           ├── config.js           # Configuración
│           ├── user-identity.js    # Gestión de usuarios
│           ├── passkey-auth.js     # Autenticación Passkey
│           ├── stellar-wallet.js   # Manejo de billetera
│           ├── video-manager.js    # Gestión de videos
│           └── ui-controller.js    # Controlador de UI
├── backend/
│   ├── index.js                    # Servidor Express
│   ├── routes/
│   │   └── videos.js               # Rutas de videos
│   └── controllers/
│       └── videosController.js     # Lógica de videos
├── netlify.toml                    # Config de Netlify
└── README.md
```

## 🚀 Instalación Local

### Prerrequisitos
- Node.js 16+
- Cuenta Stellar Testnet ([crear aquí](https://laboratory.stellar.org/#account-creator?network=test))

### Backend

```bash
cd backend
npm install
npm start
```

El backend estará en `http://localhost:3000`

### Frontend

Usa Live Server o cualquier servidor HTTP estático:

```bash
cd frontend/public
# Con Live Server (VS Code)
# O con Python:
python -m http.server 5500
```

El frontend estará en `http://localhost:5500`

## 🌐 Deployment

### Frontend en Netlify

1. Conecta tu repositorio de GitHub a Netlify
2. Configuración de build:
   - **Build command**: `echo 'No build needed'`
   - **Publish directory**: `frontend/public`
3. Deploy!

### Backend en Railway

1. Crea un nuevo proyecto en [Railway.app](https://railway.app)
2. Conecta tu repositorio de GitHub
3. Configuración:
   - **Root directory**: `backend`
   - **Start command**: `npm start`
4. Copia la URL del deploy
5. Actualiza `BACKEND_URL_PROD` en `frontend/public/js/config.js`

## 🔑 Uso

### 1. Registro

1. Abre la aplicación
2. Crea una cuenta con tu dirección pública de Stellar (G...)
3. Ingresa tu nombre y avatar

### 2. Importar Billetera

1. Ve a "Mi cuenta"
2. Importa tu clave privada (S...)
3. La clave se guarda encriptada en tu navegador

### 3. Configurar Passkey (Opcional)

1. En "Mi cuenta" > "Seguridad"
2. Click en "Configurar Passkey"
3. Usa tu huella o FaceID

### 4. Comprar Videos

1. Navega por los videos disponibles
2. Click en un video bloqueado
3. Confirma el pago
4. La transacción se ejecuta en Stellar
5. El video se desbloquea automáticamente

## 🔐 Seguridad

### ⚠️ IMPORTANTE

- **Testnet**: Esta aplicación usa Stellar Testnet (dinero de prueba)
- **Clave Privada**: Se guarda encriptada (base64) en localStorage
- **Producción**: Para uso real, implementa un sistema de custodia más robusto
- **Passkey**: Es la forma más segura de autenticación

### Mejores Prácticas

1. Nunca compartas tu clave privada
2. Usa Passkey cuando sea posible
3. Verifica las transacciones en [Stellar Expert](https://stellar.expert/explorer/testnet)
4. Mantén respaldos de tu clave privada

## 🛠️ Desarrollo

### Módulos JavaScript

- **config.js**: URLs y configuración de red
- **user-identity.js**: Registro y login de usuarios
- **passkey-auth.js**: WebAuthn para autenticación biométrica
- **stellar-wallet.js**: Interacción con Stellar (pagos, balance)
- **video-manager.js**: CRUD de videos y compras
- **ui-controller.js**: Actualización de interfaz

### API Backend

```
GET  /api/videos          # Obtener todos los videos
POST /api/videos/add      # Agregar nuevo video
GET  /api/videos/rewards  # Obtener recompensas
```

## 📝 Roadmap

- [ ] Integración con IPFS (Pinata) para almacenamiento de videos
- [ ] Sistema de comentarios
- [ ] Likes y favoritos
- [ ] Categorías y búsqueda
- [ ] Notificaciones
- [ ] Modo oscuro/claro
- [ ] Soporte para Mainnet

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE

## 🙏 Agradecimientos

- [Stellar](https://stellar.org) - Blockchain de pagos
- [Netlify](https://netlify.com) - Hosting del frontend
- [Railway](https://railway.app) - Hosting del backend

## 📞 Soporte

¿Problemas o preguntas? Abre un issue en GitHub.

---

Hecho con ❤️ usando Stellar Blockchain
