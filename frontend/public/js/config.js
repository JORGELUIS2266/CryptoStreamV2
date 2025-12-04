// frontend/public/js/config.js
// Configuración de la aplicación

const Config = {
    // URLs del backend
    BACKEND_URL_DEV: 'http://localhost:3000/api/videos',
    BACKEND_URL_PROD: 'https://believable-playfulness-production.up.railway.app/api/videos', // Actualizar después del deploy

    // Stellar
    HORIZON_URL_TESTNET: 'https://horizon-testnet.stellar.org',
    HORIZON_URL_MAINNET: 'https://horizon.stellar.org',
    NETWORK: 'TESTNET', // Cambiar a 'MAINNET' para producción

    /**
     * Obtener URL base de la API
     */
    getApiBaseUrl() {
        // Si estamos en localhost o abriendo el archivo localmente
        if (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.protocol === 'file:') {
            return 'http://localhost:3000/api';
        }
        // En producción, usar prod (Railway)
        return 'https://believable-playfulness-production.up.railway.app/api';
    },

    /**
     * Obtener URL de videos
     */
    getVideosUrl() {
        return `${this.getApiBaseUrl()}/videos`;
    },

    /**
     * Obtener URL de upload
     */
    getUploadUrl() {
        return `${this.getApiBaseUrl()}/upload`;
    },

    /**
     * Obtener URL de Horizon según la red
     */
    getHorizonUrl() {
        return this.NETWORK === 'TESTNET'
            ? this.HORIZON_URL_TESTNET
            : this.HORIZON_URL_MAINNET;
    },

    /**
     * Obtener passphrase de la red
     */
    getNetworkPassphrase() {
        return this.NETWORK === 'TESTNET'
            ? StellarSdk.Networks.TESTNET
            : StellarSdk.Networks.PUBLIC;
    },

    /**
     * Obtener URL de Stellar Expert
     */
    getStellarExpertUrl() {
        const network = this.NETWORK === 'TESTNET' ? 'testnet' : 'public';
        return `https://stellar.expert/explorer/${network}`;
    }
};

// Exportar para uso global
window.Config = Config;
