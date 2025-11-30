// frontend/public/js/upload-manager.js
// Gestor de subida de videos a IPFS

const UploadManager = {
    /**
     * Subir video a IPFS vía backend
     */
    async uploadVideo(file, onProgress) {
        const formData = new FormData();
        formData.append('video', file);

        try {
            const xhr = new XMLHttpRequest();

            return new Promise((resolve, reject) => {
                // Progreso de subida
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = Math.round((e.loaded / e.total) * 100);
                        if (onProgress) onProgress(percentComplete);
                    }
                });

                // Completado
                xhr.addEventListener('load', () => {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } else {
                        reject(new Error(`Error ${xhr.status}: ${xhr.statusText}`));
                    }
                });

                // Error
                xhr.addEventListener('error', () => {
                    reject(new Error('Error de red al subir archivo'));
                });

                // Timeout
                xhr.addEventListener('timeout', () => {
                    reject(new Error('Timeout al subir archivo'));
                });

                // Configurar y enviar
                xhr.open('POST', `${Config.getApiUrl().replace('/videos', '')}/upload`);
                xhr.timeout = 300000; // 5 minutos
                xhr.send(formData);
            });

        } catch (error) {
            console.error('Error en uploadVideo:', error);
            throw error;
        }
    },

    /**
     * Validar archivo de video
     */
    validateVideoFile(file) {
        const maxSize = 100 * 1024 * 1024; // 100MB
        const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];

        if (!file) {
            throw new Error('No se seleccionó ningún archivo');
        }

        if (!allowedTypes.includes(file.type)) {
            throw new Error('Tipo de archivo no permitido. Usa: MP4, WebM, OGG, MOV, AVI');
        }

        if (file.size > maxSize) {
            throw new Error('El archivo es demasiado grande. Máximo: 100MB');
        }

        return true;
    },

    /**
     * Formatear tamaño de archivo
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
};

// Exportar para uso global
window.UploadManager = UploadManager;
