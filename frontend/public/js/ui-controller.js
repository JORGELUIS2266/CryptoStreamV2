// frontend/public/js/ui-controller.js
// Controlador de interfaz de usuario

const UIController = {
    /**
     * Mostrar notificación
     */
    notify(message, type = 'info') {
        const notification = document.getElementById('notification');
        if (!notification) return;

        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 4000);
    },

    /**
     * Actualizar header de cuenta
     */
    updateAccountHeader(user) {
        // Nombre y avatar en navbar
        const userNameDisplay = document.getElementById('userNameDisplay');
        const userAvatarDisplay = document.getElementById('userAvatarDisplay');

        if (userNameDisplay) userNameDisplay.textContent = user.name;
        if (userAvatarDisplay) userAvatarDisplay.textContent = user.avatar;

        // Dirección corta
        const shortKey = user.publicKey
            ? `${user.publicKey.slice(0, 4)}...${user.publicKey.slice(-4)}`
            : '';

        const accountDisplay = document.getElementById('accountDisplay');
        if (accountDisplay) accountDisplay.textContent = shortKey;

        // Sección de cuenta
        const accountNameLarge = document.getElementById('accountNameLarge');
        const accountAvatarLarge = document.getElementById('accountAvatarLarge');
        const accountBio = document.getElementById('accountBio');
        const accountAddress = document.getElementById('accountAddress');

        if (accountNameLarge) accountNameLarge.textContent = user.name;
        if (accountAvatarLarge) accountAvatarLarge.textContent = user.avatar;
        if (accountBio) accountBio.textContent = user.bio || 'Sin biografía';
        if (accountAddress) accountAddress.textContent = user.publicKey || '-';
    },

    /**
     * Actualizar balance
     */
    async updateBalance(walletInstance, publicKey) {
        try {
            const balance = await walletInstance.getBalance(publicKey);
            const balanceFormatted = balance.toFixed(2);

            const balanceDisplay = document.getElementById('balanceDisplay');
            const accountBalance = document.getElementById('accountBalance');
            const fundNotice = document.getElementById('fundNotice');

            if (balanceDisplay) balanceDisplay.textContent = `💰 ${balanceFormatted} XLM`;
            if (accountBalance) accountBalance.textContent = `${balanceFormatted} XLM`;
            if (fundNotice) fundNotice.textContent = '';

        } catch (error) {
            const balanceDisplay = document.getElementById('balanceDisplay');
            const accountBalance = document.getElementById('accountBalance');
            const fundNotice = document.getElementById('fundNotice');

            if (balanceDisplay) balanceDisplay.textContent = '💰 0.00 XLM';
            if (accountBalance) accountBalance.textContent = '0.00 XLM';
            if (fundNotice) fundNotice.textContent = 'Cuenta no financiada en Testnet.';
        }
    },

    /**
     * Actualizar tabla de transacciones
     */
    async updateTransactions(walletInstance, publicKey) {
        const txBody = document.getElementById('txBody');
        if (!txBody) return;

        try {
            const transactions = await walletInstance.getTransactions(publicKey);
            txBody.innerHTML = '';

            if (transactions.length === 0) {
                txBody.innerHTML = '<tr><td colspan="4" class="muted">No hay transacciones</td></tr>';
                return;
            }

            transactions.forEach(tx => {
                const tr = document.createElement('tr');
                const txLink = `https://stellar.expert/explorer/testnet/tx/${tx.id}`;
                tr.innerHTML = `
                    <td><a class="tx-link" href="${txLink}" target="_blank">${tx.id.slice(0, 12)}...</a></td>
                    <td>${new Date(tx.created_at).toLocaleString()}</td>
                    <td class="muted">${tx.memo || '-'}</td>
                    <td><a class="tx-link" href="${txLink}" target="_blank">Ver</a></td>
                `;
                txBody.appendChild(tr);
            });

        } catch (error) {
            console.error('Error al cargar transacciones:', error);
            txBody.innerHTML = '<tr><td colspan="4" class="muted">Error al cargar transacciones</td></tr>';
        }
    },

    /**
     * Actualizar estado de billetera
     */
    updateWalletStatus(hasSecretKey) {
        const statusDiv = document.getElementById('walletStatus');
        const inputDiv = document.getElementById('walletInputDiv');

        if (!statusDiv || !inputDiv) return;

        if (hasSecretKey) {
            statusDiv.innerHTML = '✅ <strong>Billetera conectada y lista para pagar</strong>';
            statusDiv.style.color = '#27ae60';
            inputDiv.style.display = 'none';
        } else {
            statusDiv.innerHTML = '⚠️ <strong>Modo solo lectura</strong>. Importa tu clave privada para poder comprar.';
            statusDiv.style.color = '#f39c12';
            inputDiv.style.display = 'block';
        }
    },

    /**
     * Actualizar estado de Passkey
     */
    updatePasskeyStatus(publicKey) {
        const btn = document.getElementById('btnPasskey');
        if (!btn) return;

        if (!PasskeyAuth.isSupported()) {
            btn.style.display = 'none';
            return;
        }

        const hasPasskey = PasskeyAuth.hasPasskey(publicKey);

        if (hasPasskey) {
            const userName = PasskeyAuth.getUserName(publicKey);
            btn.textContent = `✅ Passkey Activado (${userName})`;
            btn.disabled = true;
            btn.style.opacity = '0.7';
        } else {
            btn.textContent = '👆 Configurar Passkey';
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    },

    /**
     * Renderizar grid de videos
     */
    renderVideosGrid(videoManager) {
        const grid = document.getElementById('videosGrid');
        if (!grid) return;

        grid.innerHTML = '';
        const regularVideos = videoManager.getRegularVideos();

        if (regularVideos.length === 0) {
            grid.innerHTML = '<p class="muted">No hay videos disponibles</p>';
            return;
        }

        regularVideos.forEach(video => {
            const isPurchased = videoManager.isPurchased(video);
            const div = document.createElement('div');
            div.className = 'video-card';

            // URL para compartir (en producción sería la URL real)
            const shareUrl = window.location.origin + '/video.html?id=' + video.id;
            const shareText = `¡Mira este video en CryptoStream! ${video.title}`;

            div.innerHTML = `
                <div class="video-thumbnail" onclick="app.handleVideoClick(${video.id})">
                    <span>${video.emoji || '🎬'}</span>
                    <div class="play-button">${isPurchased ? '▶️' : '🔒'}</div>
                </div>
                <div class="video-info">
                    <div class="video-title">${video.title || 'Sin título'}</div>
                    <div class="video-meta">
                        <span>⏱️ ${Math.floor((video.duration || 0) / 60)}:${String((video.duration || 0) % 60).padStart(2, '0')}</span>
                        <span>📁 ${video.category || '-'}</span>
                    </div>
                    
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
                        <div class="reward-badge" style="background: ${isPurchased ? '#27ae60' : '#f39c12'}">
                            ${isPurchased ? '✅ Disponible' : '💰 ' + video.reward + ' XLM'}
                        </div>
                        ${video.owner === videoManager.currentUser?.publicKey ? `
                        <div style="display:flex;gap:8px;">
                            <button class="small-btn btn-delete" onclick="app.deleteVideo(${video.id})">🗑️</button>
                        </div>` : ''}
                    </div>

                    <!-- Botones de compartir -->
                    <div class="share-buttons" style="display:flex;gap:0.5rem;border-top:1px solid rgba(255,255,255,0.1);padding-top:1rem;">
                        <button class="share-btn whatsapp" onclick="app.shareVideo('whatsapp', '${video.id}', '${video.title}')" title="Compartir en WhatsApp">
                            📱
                        </button>
                        <button class="share-btn twitter" onclick="app.shareVideo('twitter', '${video.id}', '${video.title}')" title="Compartir en X">
                            🐦
                        </button>
                        <button class="share-btn copy" onclick="app.shareVideo('copy', '${video.id}', '${video.title}')" title="Copiar enlace">
                            🔗
                        </button>
                    </div>
                </div>
            `;
            grid.appendChild(div);
        });
    },

    /**
     * Renderizar Reels
     */
    renderReels(videoManager) {
        const container = document.getElementById('reelsContainer');
        if (!container) return;

        container.innerHTML = '';
        const reels = videoManager.getReels();

        if (reels.length === 0) {
            container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;">No hay reels disponibles. ¡Sube el primero!</div>';
            return;
        }

        reels.forEach(video => {
            const isPurchased = videoManager.isPurchased(video);
            const div = document.createElement('div');
            div.className = 'reel-item';

            if (isPurchased) {
                div.innerHTML = `
                    <video src="${video.url}" class="reel-video" controls loop></video>
                    <div class="reel-overlay">
                        <h3>${video.title}</h3>
                        <p>${video.category} • 👤 ${video.owner.slice(0, 4)}...${video.owner.slice(-4)}</p>
                    </div>
                `;
            } else {
                div.innerHTML = `
                    <div class="reel-locked">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">🔒</div>
                        <h3 style="margin-bottom: 1rem;">Contenido Premium</h3>
                        <p style="margin-bottom: 2rem;">Desbloquea este Reel por <strong>${video.reward} XLM</strong></p>
                        <button class="btn btn-freighter" onclick="app.buyVideo(${video.id})">
                            🔓 Comprar Ahora
                        </button>
                    </div>
                `;
            }

            container.appendChild(div);
        });
    },

    /**
     * Renderizar tabla de mis videos
     */
    renderMyVideosTable(videoManager) {
        const tbody = document.getElementById('myVideosBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        const myVideos = videoManager.getMyVideos();

        if (myVideos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="muted">No has subido videos</td></tr>';
            return;
        }

        myVideos.forEach(video => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${video.id}</td>
                <td>${video.title || '-'}</td>
                <td><a class="tx-link" href="${video.url}" target="_blank">${video.url.slice(0, 40)}${video.url.length > 40 ? '...' : ''}</a></td>
                <td>${video.reward || 0} XLM</td>
                <td>
                    <button class="small-btn btn-delete" onclick="app.deleteVideo(${video.id})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    /**
     * Actualizar estadísticas
     */
    updateStats(videoManager) {
        const totalVideos = document.getElementById('totalVideos');
        if (totalVideos) {
            totalVideos.textContent = videoManager.videos.length;
        }

        // Cargar stats de localStorage
        const stats = JSON.parse(localStorage.getItem('userStats') || '{"videosWatched":0,"totalEarned":0}');

        const videosWatched = document.getElementById('videosWatched');
        const totalEarned = document.getElementById('totalEarned');

        if (videosWatched) videosWatched.textContent = stats.videosWatched || 0;
        if (totalEarned) totalEarned.textContent = (stats.totalEarned || 0).toFixed(2) + ' XLM';
    }
};

// Exportar para uso global
window.UIController = UIController;
