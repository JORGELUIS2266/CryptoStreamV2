// frontend/public/js/upload-manager-simple.js
// Gestor simplificado - solo valida URLs

const UploadManager = {
    /**
     * Validar URL de video
     */
    validateVideoUrl(url) {
        if (!url) {
            throw new Error('No se ingresó ninguna URL');
        }

        try {
            const urlObj = new URL(url);
            
            // Verificar que sea http o https
            if (!['http:', 'https:'].includes(urlObj.protocol)) {
                throw new Error('La URL debe comenzar con http:// o https://');
            }

            return true;
        } catch (e) {
            throw new Error('La URL ingresada no es válida');
        }
    },

    /**
     * Detectar tipo de plataforma de video
     */
    detectPlatform(url) {
        const urlLower = url.toLowerCase();
        
        if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
            return 'YouTube';
        } else if (urlLower.includes('vimeo.com')) {
            return 'Vimeo';
        } else if (urlLower.includes('drive.google.com')) {
            return 'Google Drive';
        } else if (urlLower.includes('dropbox.com')) {
            return 'Dropbox';
        } else if (urlLower.includes('ipfs.io') || urlLower.includes('gateway.pinata.cloud')) {
            return 'IPFS';
        }
        
        return 'Otro';
    }
};

// Exportar para uso global
window.UploadManager = UploadManager;
