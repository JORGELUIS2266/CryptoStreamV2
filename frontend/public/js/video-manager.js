// frontend/public/js/video-manager.js
// Gestión de videos y compras

const VideoManager = {
    videos: [],
    purchasedVideos: new Set(),
    currentUser: null,

    /**
     * Inicializar con usuario actual
     */
    init(user) {
        this.currentUser = user;
        this.loadPurchasedVideos();
        console.log('🎬 Video Manager inicializado');
    },

    /**
     * Cargar videos comprados desde localStorage
     */
    loadPurchasedVideos() {
        if (!this.currentUser) return;

        const storageKey = `purchasedVideos_${this.currentUser.publicKey}`;
        const purchased = JSON.parse(localStorage.getItem(storageKey) || '[]');
        this.purchasedVideos = new Set(purchased);

        console.log(`📦 ${this.purchasedVideos.size} videos comprados cargados`);
    },

    /**
     * Marcar video como comprado
     */
    markAsPurchased(videoId) {
        this.purchasedVideos.add(videoId.toString());

        const storageKey = `purchasedVideos_${this.currentUser.publicKey}`;
        localStorage.setItem(
            storageKey,
            JSON.stringify(Array.from(this.purchasedVideos))
        );

        console.log(`✅ Video ${videoId} marcado como comprado`);
    },

    /**
     * Verificar si un video está comprado
     */
    isPurchased(video) {
        if (!video) return false;

        // Gratis si no tiene precio
        if (video.reward == 0) return true;

        // Gratis si es del usuario actual
        if (video.owner === this.currentUser?.publicKey) return true;

        // Verificar si está en la lista de comprados
        return this.purchasedVideos.has(video.id.toString());
    },

    /**
     * Cargar videos desde el backend
     */
    async loadVideos(backendUrl) {
        try {
            // Si no se pasa URL, usar la de config
            const url = backendUrl || Config.getVideosUrl();
            const response = await fetch(url);
            const videos = await response.json();
            this.videos = Array.isArray(videos) ? videos : [];

            console.log(`📹 ${this.videos.length} videos cargados desde backend`);
            return this.videos;
        } catch (error) {
            console.error('Error al cargar videos:', error);
            throw new Error('No se pudieron cargar los videos');
        }
    },

    /**
     * Obtener video por ID
     */
    getVideoById(videoId) {
        return this.videos.find(v => v.id === parseInt(videoId));
    },

    /**
     * Filtrar videos regulares (no Reels)
     */
    getRegularVideos() {
        return this.videos.filter(v => !v.isReel);
    },

    /**
     * Filtrar Reels
     */
    getReels() {
        return this.videos.filter(v => v.isReel);
    },

    /**
     * Obtener videos del usuario actual
     */
    getMyVideos() {
        if (!this.currentUser) return [];
        return this.videos.filter(v => v.owner === this.currentUser.publicKey);
    },

    /**
     * Comprar video con pago real en Stellar
     */
    async purchaseVideo(videoId, walletInstance) {
        const video = this.getVideoById(videoId);

        if (!video) {
            throw new Error('Video no encontrado');
        }

        if (this.isPurchased(video)) {
            throw new Error('Ya tienes acceso a este video');
        }

        if (!walletInstance.hasSecretKey()) {
            throw new Error('Debes importar tu clave privada primero');
        }

        // Realizar pago real en Stellar (memo máximo 28 bytes)
        const paymentResult = await walletInstance.sendPayment(
            video.owner,
            video.reward,
            `Video #${video.id}` // Memo corto para cumplir con límite de 28 bytes
        );

        // Marcar como comprado
        this.markAsPurchased(videoId);

        return {
            success: true,
            video: video,
            transaction: paymentResult
        };
    },

    /**
     * Eliminar video (solo si es del usuario)
     */
    async deleteVideo(videoId, backendUrl) {
        const video = this.getVideoById(videoId);

        if (!video) {
            throw new Error('Video no encontrado');
        }

        if (video.owner !== this.currentUser?.publicKey) {
            throw new Error('No puedes eliminar videos de otros usuarios');
        }

        try {
            const url = backendUrl || Config.getVideosUrl();
            const response = await fetch(`${url}/${videoId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Eliminar de la lista local
                this.videos = this.videos.filter(v => v.id !== videoId);
                console.log(`🗑️ Video ${videoId} eliminado`);
                return true;
            } else {
                throw new Error('Error al eliminar en el backend');
            }
        } catch (error) {
            console.error('Error al eliminar video:', error);
            throw error;
        }
    }
};

// Exportar para uso global
window.VideoManager = VideoManager;
