// frontend/public/js/passkey-auth.js
// Autenticación con Passkeys (WebAuthn) mejorada

const PasskeyAuth = {
    /**
     * Verificar si el navegador soporta Passkeys
     */
    isSupported() {
        return window.PublicKeyCredential !== undefined &&
            navigator.credentials !== undefined;
    },

    /**
     * Registrar un nuevo Passkey para el usuario
     */
    async registerPasskey(publicKey, userName) {
        if (!this.isSupported()) {
            return {
                success: false,
                error: 'Tu navegador no soporta Passkeys'
            };
        }

        try {
            // Generar challenge aleatorio
            const challenge = new Uint8Array(32);
            crypto.getRandomValues(challenge);

            // Configuración para crear credencial
            const publicKeyCredentialCreationOptions = {
                challenge: challenge,
                rp: {
                    name: "CryptoStream",
                    id: window.location.hostname
                },
                user: {
                    id: new TextEncoder().encode(publicKey),
                    name: userName,
                    displayName: userName
                },
                pubKeyCredParams: [
                    { alg: -7, type: "public-key" },  // ES256
                    { alg: -257, type: "public-key" } // RS256
                ],
                authenticatorSelection: {
                    authenticatorAttachment: "platform",
                    requireResidentKey: true,
                    userVerification: "required"
                },
                timeout: 60000,
                attestation: "none"
            };

            // Crear credencial
            const credential = await navigator.credentials.create({
                publicKey: publicKeyCredentialCreationOptions
            });

            if (!credential) {
                throw new Error('No se pudo crear la credencial');
            }

            // Guardar información del Passkey
            const passkeyData = {
                credentialId: this._arrayBufferToBase64(credential.rawId),
                publicKey: publicKey,
                userName: userName,
                createdAt: new Date().toISOString()
            };

            localStorage.setItem(`passkey_${publicKey}`, JSON.stringify(passkeyData));

            console.log('✅ Passkey registrado exitosamente para:', userName);

            return {
                success: true,
                credentialId: passkeyData.credentialId
            };

        } catch (error) {
            console.error('Error al registrar Passkey:', error);
            return {
                success: false,
                error: error.message || 'Error desconocido'
            };
        }
    },

    /**
     * Autenticar con Passkey existente
     */
    async authenticate(publicKey) {
        if (!this.isSupported()) {
            return {
                success: false,
                error: 'Tu navegador no soporta Passkeys'
            };
        }

        try {
            const passkeyData = this.getPasskeyData(publicKey);

            if (!passkeyData) {
                return {
                    success: false,
                    error: 'No hay Passkey registrado para este usuario'
                };
            }

            // Generar challenge
            const challenge = new Uint8Array(32);
            crypto.getRandomValues(challenge);

            // Configuración para autenticación
            const publicKeyCredentialRequestOptions = {
                challenge: challenge,
                allowCredentials: [{
                    id: this._base64ToArrayBuffer(passkeyData.credentialId),
                    type: 'public-key',
                    transports: ['internal']
                }],
                timeout: 60000,
                userVerification: "required"
            };

            // Solicitar autenticación
            const assertion = await navigator.credentials.get({
                publicKey: publicKeyCredentialRequestOptions
            });

            if (!assertion) {
                throw new Error('Autenticación cancelada');
            }

            console.log('✅ Autenticación exitosa con Passkey');

            return {
                success: true,
                userName: passkeyData.userName
            };

        } catch (error) {
            console.error('Error en autenticación:', error);
            return {
                success: false,
                error: error.message || 'Error en autenticación'
            };
        }
    },

    /**
     * Verificar si existe un Passkey para el usuario
     */
    hasPasskey(publicKey) {
        return localStorage.getItem(`passkey_${publicKey}`) !== null;
    },

    /**
     * Obtener datos del Passkey
     */
    getPasskeyData(publicKey) {
        const data = localStorage.getItem(`passkey_${publicKey}`);
        return data ? JSON.parse(data) : null;
    },

    /**
     * Obtener nombre de usuario del Passkey
     */
    getUserName(publicKey) {
        const data = this.getPasskeyData(publicKey);
        return data ? data.userName : null;
    },

    /**
     * Eliminar Passkey
     */
    removePasskey(publicKey) {
        localStorage.removeItem(`passkey_${publicKey}`);
        console.log('🗑️ Passkey eliminado');
    },

    /**
     * Convertir ArrayBuffer a Base64
     */
    _arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    },

    /**
     * Convertir Base64 a ArrayBuffer
     */
    _base64ToArrayBuffer(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }
};

// Exportar para uso global
window.PasskeyAuth = PasskeyAuth;
